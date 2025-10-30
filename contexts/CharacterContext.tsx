'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CharacterData {
  characterImage: string | null;
  characterName: string;
  emotion: string;
  backgroundColor: string;
  script: string;
  videoUrl: string | null;
  isTemplate: boolean;
  templateId: string | null;
}

interface CharacterContextType {
  character: CharacterData;
  updateCharacter: (updates: Partial<CharacterData>) => void;
  resetCharacter: () => void;
}

const defaultCharacter: CharacterData = {
  characterImage: null,
  characterName: '',
  emotion: 'happy',
  backgroundColor: '#FFF7ED',
  script: '',
  videoUrl: null,
  isTemplate: false,
  templateId: null,
};

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [character, setCharacter] = useState<CharacterData>(defaultCharacter);

  const updateCharacter = (updates: Partial<CharacterData>) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  };

  const resetCharacter = () => {
    setCharacter(defaultCharacter);
  };

  return (
    <CharacterContext.Provider value={{ character, updateCharacter, resetCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}
