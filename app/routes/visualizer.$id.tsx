import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { generate3DView } from "../../lib/ai.action";
import { Blocks, Download, RefreshCcw, Share2, X } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { createProject, getProjectById } from "../../lib/puter.action";

const visualizerId = () => {
  const { id } = useParams()
  const navigate = useNavigate();
  const { userId } = useOutletContext<AuthContext>();

  const hasInitialGenerated = useRef(false);
  const requestTokenRef = useRef(0);
  const [project, setProject] = useState<DesignItem | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleBack = () => navigate("/");

  const runGeneration = async (item: DesignItem) => {
    if (!id || !item.sourceImage) return;

    const capturedToken = requestTokenRef.current;
    const capturedId = id;

    setGenerationError(null);
    setIsProcessing(true);
    try {
      const result = await generate3DView({ sourceImage: item.sourceImage });

      if (capturedToken !== requestTokenRef.current || capturedId !== id) {
        return;
      }

      if (result.renderedImage) {
        const updatedItem = { ...item, renderedImage: result.renderedImage, renderedPath: result.renderedPath, timestamp: Date.now(), ownerId: item.ownerId ?? userId ?? null, isPublic: item.isPublic ?? false };
        
        const saved = await createProject({item: updatedItem, visibility: "private"})

        if (capturedToken !== requestTokenRef.current || capturedId !== id) {
          return;
        }

        if (saved) {
          setProject(saved)
          setCurrentImage(saved.renderedImage || result.renderedImage)
        } else {
          setCurrentImage(result.renderedImage);
        }
        return;
      }

      setGenerationError(
        "The 3D visualization could not be generated. Try again.",
      );
    } catch (error) {
      console.error("Generation failed:", error);
      if (capturedToken === requestTokenRef.current && capturedId === id) {
        setGenerationError(
          "The 3D visualization could not be generated. Try again.",
        );
      }
    } finally {
      if (capturedToken === requestTokenRef.current && capturedId === id) {
        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    requestTokenRef.current += 1;
    setProject(null);
    setCurrentImage(null);
    setGenerationError(null);
    setIsProcessing(false);
    hasInitialGenerated.current = false;

    const loadProject = async () => {
      if (!id) {
        setIsProjectLoading(false);
        return;
      }

      setIsProjectLoading(true);

      const fetchedProject = await getProjectById({ id });

      if (!isMounted) return;

      setProject(fetchedProject);
      setCurrentImage(fetchedProject?.renderedImage || null);
      setIsProjectLoading(false);
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (
      isProjectLoading ||
      hasInitialGenerated.current ||
      !project?.sourceImage
    )
      return;

    if (project.renderedImage) {
      setCurrentImage(project.renderedImage);
      hasInitialGenerated.current = true;
      return;
    }

    hasInitialGenerated.current = true;
    void runGeneration(project);
  }, [project, isProjectLoading]);

  return (
    <div className="visualizer">
      <nav className="topbar">
        <div className="brand">
          <Blocks className="logo" />
          <span className="name">Archio</span>
        </div>
        <Button size="sm" variant="ghost" onClick={handleBack} className="exit">
          <X className="icon" /> Exit
        </Button>
      </nav>

      <section className="content">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Project</p>
              <h2>{project?.name || `Residence ${id}`}</h2>
              <p className="note">Created by You</p>
            </div>

            <div className="panel-actions">
              <Button size="sm" className="export" onClick={()=>{}} disabled={!currentImage}>
                <Download className="w-4 h-4 mr-2"/> Export
              </Button>

              <Button size="sm" className="share" onClick={()=>{}} disabled={!currentImage}>
                <Share2 className="w-4 h-4 mr-2"/> Share
              </Button>
            </div> 
          </div>

          <div className={`render-area ${isProcessing ? "is-processing" : ""}`}>
            {currentImage ? (
              <img src={currentImage} alt="Rendered 3D View" className="render-img" />
            ) : (
              <div className="render-placeholder">
                {project?.sourceImage && (
                  <img src={project.sourceImage} alt="Original Image" className="render-fallback" />
                )}
              </div>
            )}

            {isProcessing && (
              <div className="render-overlay">
                <div className="rendering-card">
                  <RefreshCcw className="spinner" />
                  <span className="title">Rendering...</span>
                  <span className="subtitle">Generating your 3D visualization</span>
                </div>
              </div>
            )}

            {generationError && !isProcessing && (
              <div className="render-overlay">
                <div className="rendering-card">
                  <span className="title">Generation failed</span>
                  <span className="subtitle">{generationError}</span>
                  <Button size="sm" onClick={() => project && runGeneration(project)} disabled={isProcessing}>
                    <RefreshCcw className="w-4 h-4 mr-2" /> Retry
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default visualizerId;
