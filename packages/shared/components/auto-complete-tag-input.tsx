import { Tag } from "types"
import { useState } from "react"
import {
  TagInput
} from 'emblor';

interface AutoCompleteTagInputProps {
  tags: Tag[]
  selectTags?: Tag[]
  onChange?: (options: {
    removeTagIds: number[],
    newBindTagIds: number[],
    createTags: string[],
  }) => void
}

function toTagList(tags: Tag[]): { id: string, text: string }[] {
  return tags.map(tag => ({ id: tag.id.toString(), text: tag.name }))
}

function AutoCompleteTagInput({ tags, selectTags = [], onChange }: AutoCompleteTagInputProps) {
  const selectTagList = toTagList(selectTags)
  const [tagList, setTagList] = useState<Array<{ id: string, text: string }>>(selectTagList);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const autoCompleteTags = toTagList(tags);

  const setTags: React.Dispatch<React.SetStateAction<Array<{ id: string, text: string }>>> = (value) => {
    setTagList(value)
    const newTagList = typeof value === 'function' ? value(tagList) : value
    onChange?.({
      removeTagIds: autoCompleteTags.filter(tag => !newTagList.find(newTag => newTag.id === tag.id)).map(tag => parseInt(tag.id)),
      newBindTagIds: newTagList.filter(newTag => autoCompleteTags.find(tag => newTag.id === tag.id) && !selectTagList.find(tag => newTag.id === tag.id)).map(tag => parseInt(tag.id)),
      createTags: newTagList.filter(newTag => !autoCompleteTags.find(tag => newTag.id === tag.id)).map(tag => tag.text)
    })
  };
  return (
    <TagInput
      tags={tagList}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      setTags={setTags}
      enableAutocomplete={true}
      inlineTags={true}
      direction="row"
      placeholder="Add a tag"
      styleClasses={{
        tagList: {
          container: "mb-2"
        },
        inlineTagsContainer: "rounded-md",
        autoComplete: {
          popoverContent: "transform -translate-x-[7px]",
        },
        input: "rounded-md",
      }}
      autocompleteOptions={autoCompleteTags}
    >
    </TagInput>
  )
}

export default AutoCompleteTagInput