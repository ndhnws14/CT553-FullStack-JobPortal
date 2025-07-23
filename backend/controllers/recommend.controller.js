import axios from "axios";

const PYTHON_API = "http://127.0.0.1:8000";

export const recommendByIndustry = async (req, res) => {
  const industry = req.params.industry;

  try {
    const response = await axios.get(`${PYTHON_API}/recommend/industry/${industry}`);
    res.json(response.data);
  } catch (error) {
    console.error("Lỗi gọi FastAPI:", error.message);

    const status = error.response?.status || 500;
    const msg = error.response?.data?.detail || "Không lấy được gợi ý theo ngành";

    res.status(status).json({ error: msg });
  }
};


export const recommendBySkill = async (req, res) => {
  const userId = req.params.id;

  try {
    const response = await axios.get(`${PYTHON_API}/recommend/by-skill/${userId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Lỗi gọi FastAPI:", error.message);
    res.status(500).json({ error: "Không lấy được gợi ý từ hệ thống AI" });
  }
};

export const recommendSimilarJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    const response = await axios.get(`${PYTHON_API}/recommend/similar-job/${jobId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Lỗi gọi FastAPI:", error.message);
    res.status(500).json({ error: "Không lấy được gợi ý công việc tương tự" });
  }
};

export const recommendCollab = async (req, res) => {
  const userId = req.params.id;

  try {
    const response = await axios.get(`${PYTHON_API}/recommend/collab/${userId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Lỗi gọi FastAPI:", error.message);

    const status = error.response?.status || 500;
    const msg = error.response?.data?.detail || "Không lấy được gợi ý theo người dùng tương tự";

    res.status(status).json({ error: msg });
  }
};

export const recommendCandidates = async (req, res) => {
  try {
    const jobId = req.params.id;
    const response = await axios.get(`${PYTHON_API}/recommend/candidates/${jobId}`);
    res.json({ success: true, candidates: response.data });
  } catch (err) {
    console.error("Lỗi gợi ý ứng viên:", err.message);
    res.status(500).json({ success: false, message: "Lỗi khi gợi ý ứng viên" });
  }
};


