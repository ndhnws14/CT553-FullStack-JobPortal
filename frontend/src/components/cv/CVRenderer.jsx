import ClassicTemplate from "./CVTemplates/ClassicTemplate";
import CreativeTemplate from "./CVTemplates/CreativeTemplate";
import MinimalTemplate from "./CVTemplates/MinimalTemplate";
import ModernTemplate from "./CVTemplates/ModernTemplate";

const CVRenderer = ({ template, cv }) => {
  switch (template) {
    case "modern":
      return <ModernTemplate cv={cv} />;
    case "'minimal":
      return <MinimalTemplate cv={cv} />;
    case "creative":
      return <CreativeTemplate cv={cv} />;
    case "classic":
    default:
      return <ClassicTemplate cv={cv} />;
  }
};

export default CVRenderer;