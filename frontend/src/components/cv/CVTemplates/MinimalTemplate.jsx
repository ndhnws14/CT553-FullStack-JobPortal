import FormatApplyDate from "@/components/FormatApplyDate";
import React from "react";

const MinimalTemplate = ({ cv }) => {
  return (
    <div className="flex justify-center mt-4">
      <div className="w-[210mm] min-h-[297mm] bg-white border border-gray-300 p-10 font-sans text-gray-900">
        <header className="border-b pb-4 mb-6">
          <h1 className="text-3xl text-center font-bold uppercase">{cv.fullname}</h1>
          <p className="text-lg text-center text-gray-600">{cv.office}</p>
        </header>

        <section className="mb-6">
          <h2 className="text-lg font-semibold border-b mb-2">Thông tin liên hệ</h2>
          <ul className="text-sm space-y-1">
            <li><strong>Ngày sinh:</strong> {FormatApplyDate(cv.birthday)}</li>
            <li><strong>Giới tính:</strong> {cv.sex}</li>
            <li><strong>Email:</strong> {cv.email}</li>
            <li><strong>SĐT:</strong> {cv.phoneNumber}</li>
            <li><strong>Github:</strong> <a href={cv.github} className="text-blue-600 underline">{cv.github}</a></li>
            <li><strong>Địa chỉ:</strong> {cv.address}</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold border-b mb-2">Mục tiêu nghề nghiệp</h2>
          <p className="text-sm">{cv.target}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold border-b mb-2">Học vấn</h2>
          <p className="text-sm"><strong>{cv.education.schoolName}</strong> — {cv.education.course}</p>
          <p className="text-sm italic">{cv.education.major}</p>
          <p className="text-sm">{cv.education.graduate}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold border-b mb-2">Chứng chỉ</h2>
            <ul className="list-disc list-inside mt-2 text-sm">
              {cv.certificate?.split('\n').map((cert, i) => (
                <li key={i}>{cert.trim()}</li>
              ))}
            </ul>
        </section>

        {cv.skillGroups.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold border-b mb-2">Kỹ năng</h2>
            {cv.skillGroups.map((group, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold text-sm">{group.category}</p>
                <ul className="list-disc list-inside text-sm">
                  {group.skills?.map(skill => (
                    <li key={skill._id}>{skill.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {cv.experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold border-b mb-2">Kinh nghiệm</h2>
            {cv.experiences.map((exp, i) => (
              <div key={i} className="mb-4">
                <p className="font-semibold">{exp.projectName}</p>
                <p className="text-sm italic">{exp.completionTime}</p>
                <p className="text-sm">{exp.description}</p>
                {exp.link && <a href={exp.link} className="text-blue-600 underline text-sm">{exp.link}</a>}
                <p className="text-sm"><strong>Thành viên:</strong> {exp.member}</p>
                <p className="text-sm">
                  <strong>Công nghệ:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {exp.technology?.split("\n").map((tech, i) => (
                      <li key={i}>{tech.trim()}</li>
                    ))}
                  </ul>
                </p>
                <p className="text-sm">
                  <strong>Chức năng:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {exp.function?.split("\n").map((func, i) => (
                      <li key={i}>{func.trim()}</li>
                    ))}
                  </ul>
                </p>
              </div>
            ))}
          </section>
        )}

        {cv.hobbies && (
          <section>
            <h2 className="text-lg font-semibold border-b mb-2">Sở thích</h2>
            <p className="text-sm">{cv.hobbies}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;
