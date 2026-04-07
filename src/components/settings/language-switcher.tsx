'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSwitcher() {
  return (
    <div className="space-y-2">
      <Label>Langue</Label>
      <p className="text-sm text-muted-foreground">
        Choisissez la langue de l'interface.
      </p>
      <Select defaultValue="fr">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Langue" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
