'use client';

import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
        <Label>Thème</Label>
        <p className="text-sm text-muted-foreground">
            Sélectionnez un thème pour le tableau de bord.
        </p>
        <RadioGroup
            defaultValue={theme}
            onValueChange={setTheme}
            className="grid max-w-md grid-cols-3 gap-8 pt-2"
        >
            <Label className="relative cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value="light" id="light" className="sr-only" />
                <span className="flex items-center justify-center text-sm font-semibold">
                    Clair
                </span>
            </Label>
            <Label className="relative cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value="dark" id="dark" className="sr-only" />
                <span className="flex items-center justify-center text-sm font-semibold">
                    Sombre
                </span>
            </Label>
            <Label className="relative cursor-pointer rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value="system" id="system" className="sr-only" />
                <span className="flex items-center justify-center text-sm font-semibold">
                    Système
                </span>
            </Label>
        </RadioGroup>
    </div>
  );
}
