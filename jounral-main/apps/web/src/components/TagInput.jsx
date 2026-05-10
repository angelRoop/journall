import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Search, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchTags as fetchTagsFromApi, createTag, deleteTag } from '@/lib/apiClient.js';
import { toast } from 'sonner';

const TagInput = ({ selectedTags = [], onTagsChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [existingTags, setExistingTags] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    loadTags();
    
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = existingTags.filter(t => 
        t.name.toLowerCase().includes(inputValue.toLowerCase()) && 
        !selectedTags.includes(t.name)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions(existingTags.filter(t => !selectedTags.includes(t.name)).slice(0, 5));
    }
  }, [inputValue, existingTags, selectedTags]);

  const loadTags = async () => {
    try {
      const records = await fetchTagsFromApi();
      setExistingTags(records);
    } catch (error) {
      console.error('Failed to fetch tags', error);
    }
  };

  const handleDeleteTag = async (tagId, tagName) => {
    if (!confirm(`Are you sure you want to delete the tag "${tagName}"? This will remove it from all your trades.`)) {
      return;
    }

    try {
      await deleteTag(tagId);
      setExistingTags(prev => prev.filter(tag => tag.id !== tagId));
      // Also remove from selected tags if it was selected
      if (selectedTags.includes(tagName)) {
        removeTag(tagName);
      }
      toast.success(`Tag "${tagName}" deleted successfully`);
    } catch (error) {
      console.error('Failed to delete tag', error);
      toast.error('Failed to delete tag');
    }
  };

  const handleAddTag = async (tagName) => {
    const trimmed = tagName.trim();
    if (!trimmed) return;
    
    if (selectedTags.includes(trimmed)) {
      setInputValue('');
      return;
    }

    const newSelected = [...selectedTags, trimmed];
    onTagsChange(newSelected);
    setInputValue('');
    setIsOpen(false);

    // Check if tag exists in DB, if not, create it
    const exists = existingTags.some(t => t.name.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      try {
        const newTag = await createTag(trimmed);
        setExistingTags(prev => [newTag, ...prev]);
      } catch (error) {
        console.error('Failed to save new tag to database', error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  const removeTag = (tagToRemove) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* Previously Used Tags Section */}
      {existingTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Previously Used Tags</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{existingTags.length} available</span>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTagsChange([])}
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear Selected
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {existingTags.map(tag => {
              const isSelected = selectedTags.includes(tag.name);
              return (
                <div key={tag.id} className="flex items-center gap-1 group">
                  <Badge
                    variant={isSelected ? "default" : "outline"}
                    className={`px-2 py-1 text-xs cursor-pointer transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted hover:text-foreground'
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        removeTag(tag.name);
                      } else {
                        handleAddTag(tag.name);
                      }
                    }}
                  >
                    {tag.name}
                    {isSelected && (
                      <button
                        onClick={(e) => { e.preventDefault(); removeTag(tag.name); }}
                        className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${tag.name} tag`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                  <button
                    onClick={(e) => { e.preventDefault(); handleDeleteTag(tag.id, tag.name); }}
                    className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-colors p-1 rounded"
                    aria-label={`Delete ${tag.name} tag permanently`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Tags Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Selected Tags</span>
          <div className="flex items-center gap-2">
            {selectedTags.length > 0 && <span className="text-xs text-muted-foreground">{selectedTags.length} used</span>}
            {selectedTags.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTagsChange([])}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="px-2 py-1 text-sm flex items-center gap-1 bg-secondary text-secondary-foreground">
              {tag}
              <button
                onClick={(e) => { e.preventDefault(); removeTag(tag); }}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${tag} tag`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {selectedTags.length === 0 && <span className="text-sm text-muted-foreground py-1">No tags selected</span>}
        </div>
      </div>

      {/* Search and Add New Tag Section */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search or create tags..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            className="pl-9 pr-24"
          />
          <Button 
            size="sm" 
            variant="ghost" 
            className="absolute right-1 h-7 text-xs font-medium"
            onClick={(e) => {
              e.preventDefault();
              handleAddTag(inputValue);
            }}
            disabled={!inputValue.trim()}
          >
            Add Tag
          </Button>
        </div>

        {isOpen && (suggestions.length > 0 || inputValue.trim()) && (
          <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md overflow-hidden max-h-60 overflow-y-auto">
            <div className="p-1 flex flex-col">
              {suggestions.map(tag => (
                <button
                  key={tag.id}
                  className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddTag(tag.name);
                  }}
                >
                  <span>{tag.name}</span>
                </button>
              ))}
              
              {inputValue.trim() && !suggestions.some(s => s.name.toLowerCase() === inputValue.trim().toLowerCase()) && (
                <button
                  className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2 text-primary font-medium border-t mt-1 pt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddTag(inputValue);
                  }}
                >
                  <Plus className="w-4 h-4" /> Create "{inputValue}"
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;