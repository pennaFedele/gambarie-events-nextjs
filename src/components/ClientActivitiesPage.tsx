'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Map } from "lucide-react";
import { useTranslation } from 'react-i18next';
import type { Activity } from '@/lib/cache/activities';

interface ClientActivitiesPageProps {
  activities: Activity[];
}

export function ClientActivitiesPage({ activities }: ClientActivitiesPageProps) {
  const { t, i18n } = useTranslation();
  const isItalian = i18n.language === 'it';

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Sport":
        return "bg-blue-100 text-blue-800";
      case "Avventura":
      case "Adventure":
        return "bg-green-100 text-green-800";
      case "Natura":
      case "Nature":
        return "bg-emerald-100 text-emerald-800";
      case "Famiglia":
      case "Family":
        return "bg-orange-100 text-orange-800";
      case "Benessere":
      case "Wellness":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => (
        <div key={activity.id} className="h-full hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg border p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                {isItalian ? activity.title_it : activity.title_en}
              </h3>
              <Badge className={getTypeColor(isItalian ? activity.type_it : activity.type_en)}>
                {isItalian ? activity.type_it : activity.type_en}
              </Badge>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            {isItalian ? activity.description_it : activity.description_en}
          </p>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              {activity.info_links && activity.info_links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activity.info_links.map((link, index) => (
                    <Button 
                      key={index}
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(link.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {link.label}
                    </Button>
                  ))}
                </div>
              )}
              {activity.maps_links && activity.maps_links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activity.maps_links.map((link, index) => (
                    <Button 
                      key={index}
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(link.url, '_blank')}
                    >
                      <Map className="w-4 h-4 mr-2" />
                      {link.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}