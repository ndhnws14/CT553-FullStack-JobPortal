import dialogflow from "dialogflow";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { TechSkill } from "../models/techskill.model.js";

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "./dialogflow-key.json",
});

const PROJECT_ID = process.env.DIALOGFLOW_PROJECT_ID;

export const postChatbot = async (req, res) => {
  const { message } = req.body;

  const sessionPath = sessionClient.sessionPath(PROJECT_ID, "user-session-001");

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: "vi",
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    const intent = result.intent.displayName;

    let reply = result.fulfillmentText;

    // Xử lý logic tùy theo intent
    if (intent === "Top công việc được xem nhiều nhất") {
      const jobs = await Job.find()
                            .sort({ views: -1 })
                            .limit(3)
                            .populate("company")
                            .populate("requiredSkills");
      reply = {
        type: "job_list",
        data: jobs,
      };
    }

    if (intent === "Top công ty được chú ý nhiều nhất") {
      const companies = await Company.find().sort({ views: -1 }).limit(3);
      reply = {
        type: "company_list",
        data: companies,
      };
    }

    if (intent === "Công việc theo kỹ năng") {
        const skillName = result.parameters.fields["skill"]?.stringValue;

        if (!skillName) {
            reply = "Bạn muốn tìm công việc liên quan đến kỹ năng nào vậy?";
        } else {
            const skill = await TechSkill.findOne({
                name: { $regex: new RegExp(`^${skillName}$`, "i") },
            });

            if (!skill) {
                reply = `Không tìm thấy kỹ năng "${skillName}" trong hệ thống.`;
            } else {
                const jobs = await Job.find({ requiredSkills: skill._id })
                    .limit(3)
                    .populate("company")
                    .populate("requiredSkills");

                if (jobs.length > 0) {
                    reply = {
                        type: "job_list",
                        data: jobs,
                    };
                } else {
                    reply = `Hiện chưa có công việc nào yêu cầu kỹ năng "${skillName}".`;
                }
            }
        }
    }

    if (intent === "Tìm ứng viên theo kỹ năng") {
      const skillName = result.parameters.fields["skill"]?.stringValue;

      if (!skillName) {
        reply = "Bạn muốn tìm ứng viên thành thạo kỹ năng nào?";
      } else {
        const techSkill = await TechSkill.findOne({
          name: { $regex: new RegExp(`^${skillName}$`, "i") },
        });

        if (!techSkill) {
          reply = `Không tìm thấy kỹ năng "${skillName}" trong hệ thống.`;
        } else {
          // ✅ Tìm ứng viên có skill đó trong profile.skills
          const users = await User.find({
            role: "Ứng viên",
            "profile.skills.skill": techSkill._id,
          })
            .populate("profile.skills.skill")
            .populate("profile.level");

          if (users.length === 0) {
            reply = `Không tìm thấy ứng viên nào có kỹ năng "${skillName}".`;
          } else {
            reply = {
              type: "user_list",
              data: users,
            };
          }
        }
      }
    }
    

    res.json({ success: true, reply: { role: "assistant", content: reply } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi xử lý chatbot với Dialogflow" });
  }
};
