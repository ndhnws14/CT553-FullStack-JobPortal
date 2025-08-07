import FormatApplyDate from "@/components/FormatApplyDate";
import React from "react";

const CreativeTemplate = ({ cv, resumeRef }) => {
  return (
    <div ref={resumeRef} className="flex justify-center mt-4">
      <div className="w-[210mm] min-h-[297mm] bg-gradient-to-br from-pink-100 to-blue-100 p-10 shadow-lg rounded-lg text-gray-800 font-sans">
        <div className="flex items-center gap-6 mb-6">
          <img src={cv.avatar} alt="avatar" className="w-40 h-40 object-cover rounded-full border-4 border-pink-400" />
          <div>
            <h1 className="text-3xl font-extrabold text-pink-700">{cv.fullname}</h1>
            <p className="text-lg text-blue-700">{cv.office}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">

          <div className="space-y-4">
            <section>
              <h2 className="text-pink-700 font-bold text-lg">Thông tin</h2>
              <ul className="text-sm mt-2 space-y-1">
                <li><strong>Ngày sinh:</strong> {FormatApplyDate(cv.birthday)}</li>
                <li><strong>Giới tính:</strong> {cv.sex}</li>
                <li><strong>Email:</strong> {cv.email}</li>
                <li><strong>SĐT:</strong> {cv.phoneNumber}</li>
                <li><strong>Github:</strong> <a href={cv.github} className="text-blue-600 underline">{cv.github}</a></li>
                <li><strong>Địa chỉ:</strong> {cv.address}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-pink-700 font-bold text-lg">Kỹ năng</h2>
              {cv.skillGroups.map((group, i) => (
                <div key={i} className="mt-2">
                  <p className="font-semibold text-sm">{group.category}</p>
                  <ul className="list-disc list-inside text-sm">
                    {group.skills?.map(skill => (
                      <li key={skill._id}>{skill.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <section>
              <h2 className="text-pink-700 font-bold text-lg">Chứng chỉ</h2>
              <ul className="list-disc list-inside mt-2 text-sm">
                {cv.certificate?.split('\n').map((cert, i) => (
                  <li key={i}>{cert.trim()}</li>
                ))}
              </ul>
            </section>

            {cv.hobbies && (
              <section>
                <h2 className="text-pink-700 font-bold text-lg">Sở thích</h2>
                <p className="text-sm">{cv.hobbies}</p>
              </section>
            )}
          </div>

          <div className="space-y-4">
            <section>
              <h2 className="text-pink-700 font-bold text-lg">Mục tiêu</h2>
              <p className="text-sm mt-2">{cv.target}</p>
            </section>

            <section>
              <h2 className="text-pink-700 font-bold text-lg">Học vấn</h2>
              <p className="text-sm"><strong>{cv.education.schoolName}</strong> — {cv.education.course}</p>
              <p className="text-sm italic">{cv.education.major}</p>
              <p className="text-sm">{cv.education.graduate}</p>
            </section>

            <section>
              <h2 className="text-pink-700 font-bold text-lg">Kinh nghiệm</h2>
              {cv.experiences.map((exp, i) => (
                <div key={i} className="text-sm mt-2 border-b pb-2 space-y-1">
                  <p className="font-semibold">{exp.projectName}</p>
                  <p className="italic text-xs">{exp.completionTime}</p>
                  <p>{exp.description}</p>

                  {exp.link && (
                    <a
                      href={exp.link}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {exp.link}
                    </a>
                  )}

                  <p><strong>Thành viên:</strong> {exp.member}</p>

                  {exp.technology && (
                    <>
                      <p><strong>Công nghệ:</strong></p>
                      <ul className="list-disc list-inside ml-4">
                        {exp.technology.split("\n").map((tech, i) => (
                          <li key={i}>{tech.trim()}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {exp.function && (
                    <>
                      <p><strong>Chức năng:</strong></p>
                      <ul className="list-disc list-inside ml-4">
                        {exp.function.split("\n").map((func, i) => (
                          <li key={i}>{func.trim()}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
