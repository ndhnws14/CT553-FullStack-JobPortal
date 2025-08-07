import FormatApplyDate from "@/components/FormatApplyDate";
import React from "react";

const ModernTemplate = ({ cv, resumeRef }) => {
  return (
    <div ref={resumeRef} className="flex justify-center mt-4">
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-lg border border-gray-200 flex">

        <div className="w-1/3 bg-blue-100 p-6 flex flex-col items-center text-gray-800">
          <img
            src={cv.avatar}
            alt="avatar"
            className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
          />
          <h1 className="mt-4 text-2xl font-bold text-blue-700 text-center">{cv.fullname}</h1>
          <p className="text-sm text-center text-blue-600 mb-6">{cv.office}</p>

          <div className="w-full text-sm space-y-2 mt-4">
            <h2 className="text-blue-700 font-semibold mb-2">Thông tin cá nhân</h2>
            <p><strong>Ngày sinh:</strong> {FormatApplyDate(cv.birthday)}</p>
            <p><strong>Giới tính:</strong> {cv.sex}</p>
            <p><strong>Email:</strong> {cv.email}</p>
            <p><strong>SĐT:</strong> {cv.phoneNumber}</p>
            <p><strong>Github:</strong> <a href={cv.github} className="text-blue-600 underline">{cv.github}</a></p>
            <p><strong>Địa chỉ:</strong> {cv.address}</p>
          </div>

          {cv.skillGroups?.length > 0 && (
            <div className="w-full mt-6 text-sm">
              <h2 className="text-blue-700 font-semibold mb-2">Kỹ năng</h2>
              {cv.skillGroups.map((group, i) => (
                <div key={i} className="mb-2">
                  <p className="font-semibold text-sm">{group.category}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {group.skills?.map(skill => (
                      <li key={skill._id}>{skill.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="w-full text-sm space-y-2 mt-4">
            <h2 className="text-blue-700 font-semibold mb-2">Chứng chỉ</h2>
            <ul className="list-disc list-inside">
              {cv.certificate?.split('\n').map((cert, i) => (
                <li key={i}>{cert.trim()}</li>
              ))}
            </ul>
          </div>

          {cv.hobbies && (
            <div className="w-full mt-6 text-sm">
              <h2 className="text-blue-700 font-semibold mb-2">Sở thích</h2>
              <p>{cv.hobbies}</p>
            </div>
          )}
        </div>

        <div className="w-2/3 p-8 flex flex-col gap-6 text-gray-900">
          <div>
            <h2 className="text-lg font-bold border-b border-blue-500 text-blue-700 pb-1">Mục tiêu nghề nghiệp</h2>
            <p className="mt-2 text-sm">{cv.target}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold border-b border-blue-500 text-blue-700 pb-1">Học vấn</h2>
            <div className="mt-2 text-sm">
              <p><strong>Trường:</strong> {cv.education?.schoolName}</p>
              <p><strong>Khóa:</strong> {cv.education?.course}</p>
              <p><strong>Ngành:</strong> {cv.education?.major}</p>
              <p>{cv.education?.graduate}</p>
            </div>
          </div>

          {cv.experiences?.length > 0 && (
            <div>
              <h2 className="text-lg font-bold border-b border-blue-500 text-blue-700 pb-1">
                Kinh nghiệm
              </h2>

              {cv.experiences.map((exp, i) => (
                <div key={i} className="mt-4 text-sm border-b pb-3 space-y-2">
                  <p className="text-blue-600 font-semibold">{exp.projectName}</p>
                  <p className="italic text-gray-500 text-xs">{exp.completionTime}</p>
                  <p>{exp.description}</p>

                  {exp.link && (
                    <p>
                      <strong>Link:</strong>{" "}
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {exp.link}
                      </a>
                    </p>
                  )}

                  <p>
                    <strong>Thành viên:</strong> {exp.member}
                  </p>

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
