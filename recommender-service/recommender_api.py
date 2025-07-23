from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from bson import ObjectId
from datetime import datetime
import numpy as np
import pandas as pd

app = FastAPI()

client = MongoClient("mongodb://localhost:27017")
db = client["geekjobs"]

model = SentenceTransformer("all-MiniLM-L6-v2")

INDUSTRY_KEYWORDS = {
    "web": ["HTML", "CSS", "JavaScript", "React", "Next.js", "Vue.js", "Node.js", "Express"],
    "mobile": ["Flutter", "React Native", "Kotlin Multiplatform", "SwiftUI"],
    "tester": ["Test", "QA", "Cypress", "Selenium"],
    "data": ["Python", "SQL", "Docker", "Machine Learning"],
    "ai": ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP"],
    "devops": ["Docker", "Kubernetes", "AWS", "CI/CD", "GitHub Actions"],
}

def serialize(doc):
    if isinstance(doc, list):
        return [serialize(d) for d in doc]
    elif isinstance(doc, dict):
        return {k: serialize(v) for k, v in doc.items()}
    elif isinstance(doc, ObjectId):
        return str(doc)
    elif isinstance(doc, datetime):
        return doc.isoformat()
    else:
        return doc

def load_jobs():
    pipeline = [
        {
            "$lookup": {
                "from": "techskills",
                "localField": "requiredSkills",
                "foreignField": "_id",
                "as": "requiredSkills"
            }
        },
        {
            "$lookup": {
                "from": "companies",
                "localField": "company",
                "foreignField": "_id",
                "as": "company"
            }
        },
        {
            "$unwind": {
                "path": "$company",
                "preserveNullAndEmptyArrays": True
            }
        }
    ]
    return list(db.jobs.aggregate(pipeline))

def load_user_skill_names(user_id):
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return []

    profile_skills_info = user.get("profile", {}).get("skills", [])
    profile_skill_ids = [s["skill"] for s in profile_skills_info if "skill" in s]

    cv_skill_ids = []
    if user.get("cvId"):
        cv = db.cv.find_one({"_id": user["cvId"]})
        if cv:
            for group in cv.get("skillGroups", []):
                cv_skill_ids.extend(group.get("skills", []))

    all_skill_ids = list(set(profile_skill_ids + cv_skill_ids))

    if not all_skill_ids:
        return []

    skills_map = {
        str(s["_id"]): s["name"]
        for s in db.techskills.find({"_id": {"$in": all_skill_ids}})
    }

    skill_names = [skills_map.get(str(sid)) for sid in all_skill_ids if str(sid) in skills_map]
    return list(filter(None, skill_names))

def build_user_job_matrix():
    apps = list(db.applications.find({}))
    if not apps:
        return None, None, None
    
    df = pd.DataFrame(apps)
    
    if 'applicant' not in df.columns or 'job' not in df.columns:
        return None, None, None

    df['user'] = df['applicant'].astype(str)
    df['job'] = df['job'].astype(str)

    user_job_matrix = pd.crosstab(df['user'], df['job'])
    return df, user_job_matrix, list(user_job_matrix.columns)

@app.get("/recommend/by-skill/{user_id}")
def recommend_by_skill(user_id: str, threshold: float = 0.4, top_k: int = 8):
    jobs = load_jobs()

    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại.")

    user_level_id = str(user.get("profile", {}).get("level"))
    if not user_level_id:
        raise HTTPException(status_code=400, detail="Người dùng chưa có level.")

    skill_names = load_user_skill_names(user_id)
    if not skill_names:
        raise HTTPException(status_code=400, detail="Không tìm thấy kỹ năng phù hợp.")

    user_skills_str = " ".join(skill_names)

    matching_jobs = [
        job for job in jobs
        if user_level_id in [str(lid) for lid in job.get("requiredLevels", [])]
    ]

    if not matching_jobs:
        return []

    job_texts = [
        " ".join(skill["name"] for skill in job.get("requiredSkills", []))
        for job in matching_jobs
    ]

    user_vec = model.encode([user_skills_str])
    job_vecs = model.encode(job_texts)
    sims = cosine_similarity(user_vec, job_vecs)[0]

    sorted_indices = sorted(range(len(sims)), key=lambda i: sims[i], reverse=True)
    top_jobs = [i for i in sorted_indices if sims[i] >= threshold][:top_k]

    if len(top_jobs) < top_k:
        additional = [i for i in sorted_indices if i not in top_jobs][:top_k - len(top_jobs)]
        top_jobs += additional

    scored_jobs = []
    for i in top_jobs:
        job = matching_jobs[i]
        job["matchScore"] = float(sims[i])
        scored_jobs.append(job)

    return serialize(scored_jobs)

@app.get("/recommend/similar-job/{job_id}")
def recommend_similar_job(job_id: str, top_k: int = 5):
    jobs = load_jobs()
    target_job = next((j for j in jobs if str(j["_id"]) == str(job_id)), None)
    if not target_job:
        raise HTTPException(status_code=404, detail="Không tìm thấy công việc.")

    job_texts = [" ".join(skill["name"] for skill in job.get("requiredSkills", [])) for job in jobs]
    job_vecs = model.encode(job_texts)

    idx = jobs.index(target_job)
    sims = cosine_similarity([job_vecs[idx]], job_vecs)[0]
    top_indices = np.argsort(sims)[::-1][1:top_k+1]
    return serialize([jobs[i] for i in top_indices])

@app.get("/recommend/collab/{user_id}")
def recommend_by_collaborative(user_id: str, top_k: int = 8):
    df, matrix, job_ids = build_user_job_matrix()
    if matrix is None:
        raise HTTPException(status_code=404, detail="Không có dữ liệu ứng tuyển.")

    if user_id not in matrix.index:
        raise HTTPException(status_code=404, detail="Người dùng chưa từng ứng tuyển.")

    sims = cosine_similarity([matrix.loc[user_id]], matrix)[0]
    similar_users = matrix.index[np.argsort(sims)[::-1][1:]]

    jobs_applied = set(matrix.loc[user_id][matrix.loc[user_id] > 0].index)
    recommended_jobs = set()

    for sim_user in similar_users:
        sim_user_jobs = matrix.loc[sim_user][matrix.loc[sim_user] > 0].index
        for job in sim_user_jobs:
            if job not in jobs_applied:
                recommended_jobs.add(job)
            if len(recommended_jobs) >= top_k:
                break
        if len(recommended_jobs) >= top_k:
            break

    all_jobs = load_jobs()
    job_objs = [job for job in all_jobs if str(job["_id"]) in recommended_jobs]

    return serialize(job_objs)

@app.get("/recommend/industry/{industry}")
def recommend_by_industry(industry: str, limit: int = 8):
    keywords = INDUSTRY_KEYWORDS.get(industry.lower())
    if not keywords:
        raise HTTPException(status_code=400, detail="Ngành không hợp lệ.")

    jobs = list(db.jobs.aggregate([
        {
            "$lookup": {
                "from": "techskills",
                "localField": "requiredSkills",
                "foreignField": "_id",
                "as": "requiredSkills"
            }
        },
        {
            "$lookup": {
                "from": "companies",
                "localField": "company",
                "foreignField": "_id",
                "as": "company"
            }
        },
        {
            "$unwind": {
                "path": "$company",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$match": {
                "requiredSkills.name": {"$in": keywords}
            }
        },
        {
            "$limit": limit
        }
    ]))

    return serialize(jobs)

@app.get("/recommend/candidates/{job_id}")
def recommend_candidates(job_id: str, top_k: int = 10):
    job = db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(404, "Không tìm thấy công việc.")

    required_skill_ids = [ObjectId(sid) for sid in job.get("requiredSkills", [])]
    required_level_ids = [ObjectId(lid) for lid in job.get("requiredLevels", [])]

    # Lấy danh sách người dùng phù hợp theo role và level
    users = list(db.users.find({
        "role": "Ứng viên",
        "profile.level": {"$in": required_level_ids}
    }))

    proficiency_weight = {
        "Cơ bản": 0.4, "Trung bình": 0.6, "Khá": 0.8, "Tốt": 1.0
    }

    results = []

    for user in users:
        profile_skills = user.get("profile", {}).get("skills", [])
        cv_skills = []

        if user.get("cvId"):
            cv = db.cv.find_one({"_id": user["cvId"]})
            if cv:
                for group in cv.get("skillGroups", []):
                    for skill in group.get("skills", []):
                        cv_skills.append({"skill": skill, "proficiency": "Trung bình"})  # mặc định

        all_skills = profile_skills + cv_skills
        score = 0
        matched_skills = []

        for s in all_skills:
            skill_id = s.get("skill")
            if skill_id in required_skill_ids:
                prof = s.get("proficiency", "Trung bình")
                score += proficiency_weight.get(prof, 0.6)

                # Lấy object skill đầy đủ từ collection techskills
                skill_obj = db.techskills.find_one({"_id": skill_id})
                if skill_obj:
                    matched_skills.append({
                        "skill": skill_obj,
                        "proficiency": prof
                    })

        # Nếu điểm match > 0, gắn thông tin trình độ và kỹ năng phù hợp
        if score > 0:
            user["matchScore"] = score

            # Lấy object level đầy đủ
            level_id = user.get("profile", {}).get("level")
            if level_id:
                level_obj = db.levels.find_one({"_id": level_id})
                if level_obj:
                    user["level_detail"] = level_obj

            user["matchedSkills"] = matched_skills

            results.append(user)

    # Sắp xếp theo điểm match giảm dần, lấy top_k
    top_candidates = sorted(results, key=lambda u: u["matchScore"], reverse=True)[:top_k]
    return serialize(top_candidates)


