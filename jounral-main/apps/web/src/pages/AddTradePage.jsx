import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createTrade, deleteTrade, getTrade, saveTemplate, updateTrade } from '@/lib/apiClient.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { toast } from 'sonner';
import { useTradeForm } from '@/hooks/useTradeForm.js';
import LiveSummaryCard from '@/components/LiveSummaryCard.jsx';
import {
  BasicDetailsSection,
  InstrumentDetailsSection,
  PositionDetailsSection,
  RiskManagementSection,
  ExecutionQualitySection,
  PsychologySection,
  TradeReviewSection,
} from '@/components/TradeFormSections.jsx';
import ImageUploadField from '@/components/ImageUploadField.jsx';
import TagInput from '@/components/TagInput.jsx';
import { Save, RotateCcw, BookmarkPlus, ArrowLeft, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AddTradePage = () => {
  const localUserId = 'local-user';
  const navigate = useNavigate();
  const { tradeId } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!tradeId);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [existingRecord, setExistingRecord] = useState(null);
  
  // State for new files to be uploaded on form submit (if not saving immediately)
  const [pendingFiles, setPendingFiles] = useState({});
  const [pendingPreviews, setPendingPreviews] = useState({});

  const { 
    formData, 
    errors,
    metrics, 
    updateField, 
    validateForm,
    resetForm,
    loadTemplate 
  } = useTradeForm();

  const isEditMode = !!tradeId;

  useEffect(() => {
    if (isEditMode) {
      fetchTrade();
    }
  }, [tradeId]);

  const fetchTrade = async () => {
    setFetching(true);
    try {
      const record = await getTrade(tradeId);
      if (!record) {
        throw new Error('Trade not found');
      }
      setExistingRecord(record);
      loadTemplate(record);
    } catch (error) {
      toast.error('Failed to load trade data');
      navigate('/dashboard');
    } finally {
      setFetching(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName) return toast.error('Template name required');
    try {
      await saveTemplate(templateName, { ...formData, ...metrics });
      toast.success('Template saved');
      setTemplateDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save template');
    }
  };

  const handleFileSelect = (field, file, previewUrl) => {
    setPendingFiles(prev => ({ ...prev, [field]: file }));
    setPendingPreviews(prev => ({ ...prev, [field]: previewUrl }));
  };

  const handleUploadSuccess = (updatedRecord) => {
    setExistingRecord(updatedRecord);
  };

  const handleDeleteTrade = async () => {
    if (!window.confirm('Are you sure you want to delete this trade? This cannot be undone.')) return;
    
    setLoading(true);
    try {
      await deleteTrade(tradeId);
      toast.success('Trade deleted');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete trade');
      setLoading(false);
    }
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { isValid, missingFields } = validateForm();
    
    if (!isValid) {
      toast.error(`Please fill required fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      const finalData = { ...formData, ...metrics, userId: localUserId };

      const imageEntries = await Promise.all(
        Object.entries(pendingFiles).map(async ([field, file]) => {
          if (!file) return [field, null];
          return [field, await fileToDataUrl(file)];
        })
      );

      imageEntries.forEach(([field, dataUrl]) => {
        if (dataUrl) {
          finalData[field] = dataUrl;
        }
      });

      if (isEditMode) {
        await updateTrade(tradeId, finalData);
        toast.success('Trade updated successfully');
      } else {
        await createTrade(finalData);
        toast.success('Trade created successfully');
      }

      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to save trade');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isFormIncomplete = !formData.symbol || !formData.entryPrice || !formData.quantity || !formData.tradingSession || !formData.marketCondition || !formData.marketType || !formData.direction;

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 py-8 max-w-[1400px] mx-auto px-4 w-full">
           <Skeleton className="h-12 w-64 mb-8" />
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-8 space-y-6"><Skeleton className="h-[400px] w-full" /></div>
             <div className="lg:col-span-4"><Skeleton className="h-[600px] w-full" /></div>
           </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditMode ? 'Edit Trade' : 'Add Trade'} - TradeJournal</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />

        <main className="flex-1 py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4">
              <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? 'Edit Trade' : 'New Trade Entry'}</h1>
              <div className="flex flex-wrap gap-2">
                {!isEditMode && (
                  <Button variant="outline" onClick={() => setTemplateDialogOpen(true)} className="gap-2 bg-background">
                    <BookmarkPlus className="w-4 h-4" /> Save Template
                  </Button>
                )}
                <Button variant="outline" onClick={resetForm} className="gap-2 bg-background">
                  <RotateCcw className="w-4 h-4" /> Reset
                </Button>
                {isEditMode && (
                  <Button variant="destructive" onClick={handleDeleteTrade} disabled={loading} className="gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                )}
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  className={`gap-2 min-w-[120px] ${isFormIncomplete ? 'opacity-80' : ''}`}
                >
                  <Save className="w-4 h-4" /> {loading ? 'Saving...' : (isEditMode ? 'Update Trade' : 'Save Trade')}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <Card className="glass-card overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Basic Details</CardTitle></CardHeader>
                  <CardContent className="pt-6"><BasicDetailsSection formData={formData} updateField={updateField} errors={errors} /></CardContent>
                </Card>

                <Card className="glass-card overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Instrument</CardTitle></CardHeader>
                  <CardContent className="pt-6"><InstrumentDetailsSection formData={formData} updateField={updateField} errors={errors} /></CardContent>
                </Card>

                <Card className="glass-card overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Position</CardTitle></CardHeader>
                  <CardContent className="pt-6"><PositionDetailsSection formData={formData} updateField={updateField} errors={errors} /></CardContent>
                </Card>

                <Card className="glass-card overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Risk Management</CardTitle></CardHeader>
                  <CardContent className="pt-6"><RiskManagementSection formData={formData} updateField={updateField} /></CardContent>
                </Card>

                <Card className="glass-card overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Strategy & Tags</CardTitle></CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Label>Custom Tags</Label>
                      <TagInput 
                        selectedTags={formData.customTags || []} 
                        onTagsChange={(tags) => updateField('customTags', tags)} 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Trade Charts & Screenshots</CardTitle></CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <ImageUploadField 
                        label="Before Entry Setup" 
                        field="beforeEntryImage" 
                        tradeId={tradeId}
                        currentImage={existingRecord?.beforeEntryImage}
                        record={existingRecord}
                        onFileSelect={handleFileSelect}
                        onUploadSuccess={handleUploadSuccess}
                      />
                      <ImageUploadField 
                        label="During Trade Management" 
                        field="duringTradeImage" 
                        tradeId={tradeId}
                        currentImage={existingRecord?.duringTradeImage}
                        record={existingRecord}
                        onFileSelect={handleFileSelect}
                        onUploadSuccess={handleUploadSuccess}
                      />
                      <ImageUploadField 
                        label="Exit Execution" 
                        field="exitImage" 
                        tradeId={tradeId}
                        currentImage={existingRecord?.exitImage}
                        record={existingRecord}
                        onFileSelect={handleFileSelect}
                        onUploadSuccess={handleUploadSuccess}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Execution Quality</CardTitle></CardHeader>
                  <CardContent className="pt-6"><ExecutionQualitySection formData={formData} updateField={updateField} /></CardContent>
                </Card>

                <Card className="glass-card overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Psychology</CardTitle></CardHeader>
                  <CardContent className="pt-6"><PsychologySection formData={formData} updateField={updateField} /></CardContent>
                </Card>

                <Card className="glass-card overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b pb-4"><CardTitle>Review Notes</CardTitle></CardHeader>
                  <CardContent className="pt-6"><TradeReviewSection formData={formData} updateField={updateField} /></CardContent>
                </Card>
              </div>

              <div className="lg:col-span-4 relative">
                <div className="sticky top-24">
                  <LiveSummaryCard metrics={metrics} formData={formData} />
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="e.g. Morning Breakout" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTemplate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTradePage;