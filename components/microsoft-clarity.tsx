'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_MS_CLARITY_PROJECT_ID;

export function MicrosoftClarity() {
  useEffect(() => {
    if (!CLARITY_PROJECT_ID) {
      return;
    }

    // Initialize Clarity only on the client side
    Clarity.init(CLARITY_PROJECT_ID);
  }, []);

  return null;
}
