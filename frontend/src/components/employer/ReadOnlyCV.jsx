import React from "react";
import CVRenderer from "../cv/CVRenderer";

const ReadOnlyCV = ({ cv }) => {
  if (!cv) return <p>Đang tải CV...</p>;

  return (
    <div>
      <CVRenderer template={cv.template} cv={cv} />
    </div>
  );
};

export default ReadOnlyCV;
