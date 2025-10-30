export interface CharacterTemplate {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  category: string;
  description: string;
}

export const characterTemplates: CharacterTemplate[] = [
  {
    id: 'child-happy',
    name: 'Happy Kid',
    emoji: '😊',
    bgColor: '#FED7AA',
    category: 'child',
    description: 'A cheerful and friendly child character',
  },
  {
    id: 'child-cool',
    name: 'Cool Kid',
    emoji: '😎',
    bgColor: '#BFDBFE',
    category: 'child',
    description: 'A confident and cool kid character',
  },
  {
    id: 'teen-friendly',
    name: 'Friendly Teen',
    emoji: '🎓',
    bgColor: '#FDE68A',
    category: 'teen',
    description: 'A smart and friendly teenager',
  },
  {
    id: 'teen-sporty',
    name: 'Sporty Teen',
    emoji: '⚽',
    bgColor: '#BBF7D0',
    category: 'teen',
    description: 'An athletic and energetic teen',
  },
  {
    id: 'adult-professional',
    name: 'Professional',
    emoji: '💼',
    bgColor: '#E9D5FF',
    category: 'adult',
    description: 'A professional and capable adult',
  },
  {
    id: 'adult-creative',
    name: 'Creative Artist',
    emoji: '🎨',
    bgColor: '#FBCFE8',
    category: 'adult',
    description: 'A creative and artistic character',
  },
  {
    id: 'animal-cat',
    name: 'Clever Cat',
    emoji: '🐱',
    bgColor: '#FED7AA',
    category: 'animal',
    description: 'A smart and curious cat character',
  },
  {
    id: 'animal-dog',
    name: 'Loyal Dog',
    emoji: '🐶',
    bgColor: '#FCA5A5',
    category: 'animal',
    description: 'A friendly and loyal dog character',
  },
];

export const emotions = [
  { value: 'happy', label: '😊 Happy', expression: 'happy' },
  { value: 'sad', label: '😢 Sad', expression: 'sad' },
  { value: 'excited', label: '🤩 Excited', expression: 'excited' },
  { value: 'thoughtful', label: '🤔 Thoughtful', expression: 'thoughtful' },
  { value: 'surprised', label: '😲 Surprised', expression: 'surprised' },
];

export const backgroundColors = [
  { value: '#FFF7ED', label: 'Warm Cream', color: '#FFF7ED' },
  { value: '#FED7AA', label: 'Orange', color: '#FED7AA' },
  { value: '#BFDBFE', label: 'Sky Blue', color: '#BFDBFE' },
  { value: '#BBF7D0', label: 'Mint Green', color: '#BBF7D0' },
  { value: '#FDE68A', label: 'Sunny Yellow', color: '#FDE68A' },
  { value: '#E9D5FF', label: 'Soft Purple', color: '#E9D5FF' },
  { value: '#FBCFE8', label: 'Pink', color: '#FBCFE8' },
  { value: '#F3F4F6', label: 'Light Gray', color: '#F3F4F6' },
];
