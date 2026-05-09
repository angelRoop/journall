import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchTags as fetchTagsFromApi, createTag } from '@/lib/apiClient.js';
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
    <div className="space-y-3" ref={containerRef}>
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {selectedTags.map(tag => (
          <Badge key={tag} variant="secondary" className="px-2 py-1 text-sm flex items-center gap-1 group bg-secondary text-secondary-foreground">
            {tag}
            <button 
              onClick={(e) => { e.preventDefault(); removeTag(tag); }}
              className="opacity-50 group-hover:opacity-100 hover:text-destructive transition-colors outline-none"
              aria-label={`Remove ${tag} tag`}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        {selectedTags.length === 0 && <span className="text-sm text-muted-foreground py-1">No tags selected</span>}
      </div>

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