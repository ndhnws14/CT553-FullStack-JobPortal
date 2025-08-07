import ClassicTemplate from "./CVTemplates/ClassicTemplate";
import CreativeTemplate from "./CVTemplates/CreativeTemplate";
import MinimalTemplate from "./CVTemplates/MinimalTemplate";
import ModernTemplate from "./CVTemplates/ModernTemplate";

const CVRenderer = ({ template, cv, resumeRef }) => {
  switch (template) {
    case "modern":
      return <ModernTemplate cv={cv} resumeRef={resumeRef} />;
    case "'minimal":
      return <MinimalTemplate cv={cv} resumeRef={resumeRef} />;
    case "creative":
      return <CreativeTemplate cv={cv} resumeRef={resumeRef} />;
    case "classic":
    default:
      return <ClassicTemplate cv={cv} resumeRef={resumeRef} />;
  }
};

export default CVRenderer;