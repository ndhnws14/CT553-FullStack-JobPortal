import validator from "validator";

export const validateCVData = (data) => {
  const {
    fullname, office, birthday, sex, email, address, github, target,
    education, skillGroups, experiences
  } = data;

  if (
    !fullname || !office || !birthday || !sex || !email ||
    !address || !github || !target ||
    !education?.schoolName || !education?.course ||
    !education?.major || !education?.graduate ||
    !Array.isArray(skillGroups) || skillGroups.length === 0 ||
    !Array.isArray(experiences) || experiences.length === 0
  ) return "Vui lòng nhập đầy đủ các thông tin.";

  if (!validator.isEmail(email)) return "Email không hợp lệ.";
  if (data.phoneNumber && !validator.isMobilePhone(data.phoneNumber)) return "Số điện thoại không hợp lệ.";

  return null;
};
