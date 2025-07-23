import FormatApplyDate from "@/components/FormatApplyDate";
import React from "react";

const ClassicTemplate = ({ cv }) => {
  return (
    <div className="flex justify-center mt-4">
      <div className="w-[210mm] min-h-[297mm] bg-white p-6 shadow border border-gray-300">
        <div className="flex gap-5">
          <div className="w-1/5 flex flex-col gap-4">
            <div className="flex flex-col items-center mt-2">
              <img src={cv.avatar} alt="Avatar" className="w-40 h-48 object-cover border" />
            </div>
          </div>

          <div className="w-4/5 flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold">{cv.fullname}</h1>
              <p className="text-xl">{cv.office}</p>
              <p><strong>Ngày sinh:</strong> {FormatApplyDate(cv.birthday)}</p>
              <p><strong>Giới tính:</strong> {cv.sex}</p>
              <p><strong>Email:</strong> {cv.email}</p>
              <p><strong>Điện thoại:</strong> {cv.phoneNumber}</p>
              <p><strong>Github:</strong> <a href={cv.github} className="text-blue-600 underline">{cv.github}</a></p>
              <p><strong>Địa chỉ:</strong> {cv.address}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg mt-6 mb-1">Mục tiêu nghề nghiệp</h2>
          <p className='border-b-2 border-b-black'></p>
          <p>{cv.target}</p>
        </div>

        <div className="mt-6">
          <h2 className="font-bold text-lg mb-1">Học vấn</h2>
          <p className="border-b-2 border-b-black mb-2"></p>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <p>{cv.education?.course}</p>
            </div>

            <div className="md:w-2/3 space-y-1">
              <p><strong>Trường:</strong> {cv.education?.schoolName}</p>
              <p><strong>Ngành:</strong> {cv.education?.major}</p>
              <p>{cv.education?.graduate}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg mt-6 mb-1">Kỹ năng</h2>
          <p className="border-b-2 border-b-black mb-2"></p>
          {cv.skillGroups?.map((group, i) => (
            <div key={i} className="flex mb-3">
              <div className="w-1/3 font-semibold text-md">
                {group.category}
              </div>

              <div className="w-2/3">
                <ul className="list-disc list-inside text-sm">
                  {group.skills?.map(skill => (
                    <li key={skill._id}>{skill.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-bold text-lg mt-6 mb-1">Chứng chỉ</h2>
          <p className='border-b-2 border-b-black'></p>
          <ul className="list-disc list-inside">
            {cv.certificate?.split('\n').map((cert, i) => (
              <li key={i}>{cert.trim()}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-lg mt-6 mb-1">Kinh nghiệm</h2>
          <p className="border-b-2 border-b-black mb-2"></p>

          {cv.experiences?.map((exp, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-6 mb-4">
              <div className="md:w-1/4 text-sm italic text-gray-600">
                {exp.completionTime}
              </div>

              <div className="md:w-3/4 space-y-1">
                <p className="font-semibold">{exp.projectName}</p>
                <p>{exp.description}</p>
                <p><strong>Thành viên:</strong> {exp.member}</p>
                <div>
                  <strong>Công nghệ:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {exp.technology?.split("\n").map((tech, i) => (
                      <li key={i}>{tech.trim()}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong>Chức năng:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {exp.function?.split("\n").map((func, i) => (
                      <li key={i}>{func.trim()}</li>
                    ))}
                  </ul>
                </div>
                {exp.link && (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Xem dự án
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          {cv.hobbies && (
            <div>
              <h2 className="font-bold text-lg mt-6 mb-1">Sở thích</h2>
              <p className='border-b-2 border-b-black'></p>
              <p>{cv.hobbies}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;
