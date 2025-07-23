import admin from "firebase-admin";
import bcrypt from "bcryptjs";
import jwt from"jsonwebtoken";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Level } from "../models/level.model.js";
import { TechSkill } from "../models/techskill.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendMail } from "../utils/sendEmail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceAccount = path.join(__dirname, '../geekjobs-9caad-firebase-adminsdk-fbsvc-6e1c31bb26.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

//REGISTER
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, confirmPassword, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !confirmPassword || !role) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ các thông tin!",
                success: false
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Email không hợp lệ!",
                success: false
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Mật khẩu phải có ít nhất 6 ký tự!",
                success: false
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Mật khẩu và xác nhận mật khẩu không khớp!",
                success: false
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email này đã được đăng ký. Vui lòng chọn email khác!",
                success: false
            });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "Vui lòng tải lên ảnh đại diện!",
                success: false
            });
        }

        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                message: "Chỉ chấp nhận file ảnh JPG hoặc PNG!",
                success: false
            });
        }

        if (file.size === 0) {
            return res.status(400).json({
                message: "Ảnh tải lên bị lỗi, vui lòng chọn lại!",
                success: false
            });
        }

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            resource_type: "image",
            folder: "images",
            access_mode: "public",
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            type: "login",
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Tạo tài khoản thành công!",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi máy chủ!",
            success: false,
            error: error.message
        });
    }
};
// LOGIN
export const login = async(req, res) => {
    try {
        const {email, password, role} = req.body;
        if(!email || !password || (email !== "qtv@gmail.com" && !role)){
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ các thông tin!",
                success: false
            });
        }
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Email không hợp lệ!", success: false });
            }
        }
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                message: "Tài khoản hoặc mật khẩu không đúng!",
                success: false
            });      
        }
        const isPasswordMacth = await bcrypt.compare(password, user.password);
        if (!isPasswordMacth) {
            return res.status(400).json({
                message: "Tài khoản hoặc mật khẩu không đúng!",
                success: false
            });      
        }

        if (user.email !== "qtv@gmail.com" && role !== user.role) {
            return res.status(400).json({
                message: "Tài khoản không đúng vai trò!",
                success: false
            });      
        }

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: '1d'});

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            type: user.type,
            profile: user.profile,
            cvId: user.cvId,
        }

        return res.status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000, 
                httpOnly: true, 
                sameSite: 'lax'
            })
            .json({
                message: `Chào mừng ${user.fullname}`,
                user,
                token,
                success: true
            });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Đã có lỗi xảy ra!", success: false });
    }
}
//LOGOUT
export const logout = async(req,res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge: 0}).json({
            message: "Đăng xuất thành công.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
//LOGIN GOOGLE
export const loginGoogle = async (req, res) => {
    try {
        const { credential } = req.body; 
        const decodedToken = await admin.auth().verifyIdToken(credential);
        const { email, name, picture, uid } = decodedToken;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                fullname: name,
                email,
                phoneNumber: "",
                password: "", 
                role: "Ứng viên",
                type: "loginGoogle",
                profile: {
                    profilePhoto: picture,
                },
                cvId: null,
                googleId: uid,
            });
        }

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

        const now = new Date();
        const loginTime = now.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
        
        await sendMail(
            email,
            "Thông báo đăng nhập thành công",
            `<h1>GEEKJOBS.vn</h1>
            <h3>Xin chào ${name},</h3>
            <p>Bạn vừa đăng nhập thành công vào tài khoản của mình lúc <strong>${loginTime}</strong>.</p>
            <p>Nếu không phải bạn, vui lòng đổi mật khẩu ngay hoặc liên hệ với chúng tôi.</p>
            <br>
            <p>Trân trọng,<br>Website của bạn</p>`
        );

        return res.status(200).cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
        }).json({
            message: `Chào mừng ${user.fullname}`,
            user,
            token,
            success: true,
        });
    } catch (error) {
        console.error("Google login error:", error);
        return res.status(500).json({
            message: "Đăng nhập bằng Google thất bại!",
            success: false,
        });
    }
};
//RESET PASWORD
export const resetPassword = async (req, res) => {
    try {
        const userId = req.id;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "Người dùng không tồn tại!",
                success: false
            });
        }

        if (user.type === 'loginGoogle') {
            return res.status(400).json({
                message: "Tài khoản đăng nhập bằng Google không thể thay đổi mật khẩu.",
                success: false
            });
        }

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu mới!",
                success: false
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
                success: false
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Mật khẩu mới và xác nhận mật khẩu mới không khớp!",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Mật khẩu cũ không đúng!",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            message: "Đổi mật khẩu thành công.",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi máy chủ!",
            success: false,
            error: error.message
        });
    }
};
//GET ME
export const getMe = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                message: "Không tìm thấy người dùng", 
                success: false 
            });
        }
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Đã có lỗi xảy ra.",
            success: false
        });
    }
};
//GET ALL USER
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "Quản trị viên" } });
        if (!users) {
            return res.status(404).json({ 
                message: "Không tìm thấy người dùng", 
                success: false 
            });
        }
        return res.status(200).json({
            users,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã có lỗi xảy ra.",
            success: false
        });
    }
};
//DELETE USER
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng",
                success: false
            });
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            message: "Xóa người dùng thành công",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi khi xóa người dùng",
            success: false
        });
    }
};
//UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, level, skills, github } = req.body;
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại!", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email không hợp lệ!", success: false });
      }

      const existingEmailUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingEmailUser) {
        return res.status(400).json({
          message: "Email này đã được sử dụng bởi tài khoản khác!",
          success: false,
        });
      }

      user.email = email;
    }

    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (github) user.profile.github = github;

    if (level) {
        const isLevelValid = await Level.findById(level);
        if (!isLevelValid) {
            return res.status(400).json({
            message: "Trình độ không tồn tại!",
            success: false,
            });
        }
        user.profile.level = level;
    }

    if (skills && Array.isArray(skills)) {
        const validProficiencyLevels = ['Cơ bản', 'Trung bình', 'Khá', 'Tốt'];
        const formattedSkills = [];

        for (const s of skills) {
            if (!s.skill || !s.proficiency) {
                return res.status(400).json({
                    message: "Mỗi kỹ năng phải có 'skill' và 'proficiency'",
                    success: false,
                });
            }

            const skillExists = await TechSkill.findById(s.skill);
            if (!skillExists) {
                return res.status(400).json({
                    message: `Kỹ năng với ID ${s.skill} không tồn tại`,
                    success: false,
                });
            }
            
            if (!validProficiencyLevels.includes(s.proficiency)) {
                return res.status(400).json({
                    message: `'${s.proficiency}' không phải là mức độ hợp lệ`,
                    success: false,
                });
            }

            formattedSkills.push({
                skill: s.skill,
                proficiency: s.proficiency
            });
        }

        user.profile.skills = formattedSkills;
    }

    await user.save();

    return res.status(200).json({
      message: "Cập nhật thành công.",
      success: true,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
        cvId: user.cvId,
      }
    });

  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi máy chủ!",
      success: false,
      error: error.message
    });
  }
};
//SAVE JOB
export const saveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if(!jobId) {
            return res.status(400).json({
                message: "Bắt buộc.",
                success: false
            })
        }

        const job = await Job.findById(jobId);
        if(!job) {
            return res.status(400).json({
                message: "Công việc không tồn tại.",
                success: false
            })
        }

        const user = await User.findById(userId);
        if(user.savedJobs.includes(jobId)) {
            return res.status(400).json({
                message: "Bạn đã lưu công việc này rồi.",
                success: false
            })
        }

        user.savedJobs.push(jobId);
        await user.save();

        return res.status(200).json({
            message: "Công việc đã được lưu thành công.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã có lỗi xảy ra.",
            success: false
        });
    }
};
//LOVE JOB
export const loveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if(!jobId) {
            return res.status(400).json({
                message: "Bắt buộc.",
                success: false
            })
        }

        const job = await Job.findById(jobId);
        if(!job) {
            return res.status(400).json({
                message: "Công việc không tồn tại.",
                success: false
            })
        }

        const user = await User.findById(userId);
        if(user.lovedJobs.includes(jobId)) {
            return res.status(400).json({
                message: "Bạn đã yêu thích công việc này rồi.",
                success: false
            })
        }

        user.lovedJobs.push(jobId);
        await user.save();

        return res.status(200).json({
            message: "Công việc đã được thêm vào danh sách yêu thích.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã có lỗi xảy ra.",
            success: false
        });
    }
};
// FOLLOW COMPANY
export const followCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companyId = req.params.id;

        if (!companyId) {
            return res.status(400).json({
                message: "Thiếu ID công ty.",
                success: false
            });
        }

        const [user, company] = await Promise.all([
            User.findById(userId),
            Company.findById(companyId)
        ]);

        if (!user) {
            return res.status(404).json({
                message: "Người dùng không tồn tại.",
                success: false
            });
        }

        if (!company) {
            return res.status(404).json({
                message: "Công ty không tồn tại.",
                success: false
            });
        }

        const isFollowing = user.followCompanies.some(
            id => id.toString() === companyId
        );

        if (isFollowing) {
            return res.status(400).json({
                message: "Bạn đã theo dõi công ty này rồi.",
                success: false
            });
        }

        user.followCompanies.push(companyId);
        await user.save();

        return res.status(200).json({
            message: `Bạn vừa theo dõi công ty ${company.name}.`,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Đã có lỗi xảy ra.",
            success: false
        });
    }
};
//GET SAVEDJOB
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate({ path: "savedJobs" })
        return res.status(200).json({
            savedJobs: user.savedJobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã có lỗi xảy ra.",
            success: false
        });
    }
};
//GET LOVEDJOB
export const getLovedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate({ path: "lovedJobs" })

        return res.status(200).json({
            lovedJobs: user.lovedJobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã có lỗi xảy ra.",
            success: false
        });
    }
};
//DELETE SAVEDJOB
export const removeSavedJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Bắt buộc.",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Người dùng không tồn tại.",
                success: false
            });
        }

        if (!user.savedJobs.includes(jobId)) {
            return res.status(400).json({
                message: "Công việc không có trong danh sách đã lưu.",
                success: false
            });
        }

        user.savedJobs = user.savedJobs.filter(job => job.toString() !== jobId);
        await user.save();

        return res.status(200).json({
            message: "Công việc đã được xoá khỏi danh sách đã lưu.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã có lỗi xảy ra.",
            success: false
        });
    }
};
//DELETE LOVEDJOB
export const removeLovedJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Bắt buộc.",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Người dùng không tồn tại.",
                success: false
            });
        }

        if (!user.lovedJobs.includes(jobId)) {
            return res.status(400).json({
                message: "Công việc không có trong danh sách yêu thích.",
                success: false
            });
        }

        user.lovedJobs = user.lovedJobs.filter(job => job.toString() !== jobId);
        await user.save();

        return res.status(200).json({
            message: "Công việc đã được xoá khỏi danh sách yêu thích.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Đã có lỗi xảy ra.",
            success: false
        });
    }
};
//DELETE FOLLOW COMPANIES
export const unFollowCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companyId = req.params.id;

        if (!companyId) {
            return res.status(400).json({
                message: "Thiếu ID công ty.",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Người dùng không tồn tại.",
                success: false
            });
        }

        const isFollowing = user.followCompanies.some(
            id => id.toString() === companyId
        );

        if (!isFollowing) {
            return res.status(400).json({
                message: "Bạn chưa theo dõi công ty này.",
                success: false
            });
        }

        user.followCompanies = user.followCompanies.filter(
            id => id.toString() !== companyId
        );
        await user.save();

        return res.status(200).json({
            message: "Bạn đã bỏ theo dõi công ty.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Đã có lỗi xảy ra.",
            success: false
        });
    }
};

