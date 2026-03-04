import Layout from '@/components/Layout';
import { User, Smartphone, ChevronRight } from 'lucide-react';
import { useCustomer } from '@/hooks/use-banking';
import { useLocation } from 'wouter';
import { clearAccessToken } from '@/lib/auth';
import { FormattedMessage } from 'react-intl';

export default function Settings() {
  const { data: customer } = useCustomer();
  const [, setLocation] = useLocation();

  const handleSignOut = () => {
    clearAccessToken();
    setLocation('/login');
  };

  const sections = [
    {
      titleId: 'settings.profile.title',
      items: [
        { icon: User, labelId: 'settings.profile.personalInfo', value: customer?.name },
        { icon: Smartphone, labelId: 'settings.profile.contactDetails', value: customer?.email },
      ],
    },
    // {
    //   title: "Security",
    //   items: [
    //     { icon: Key, label: "Password & Authentication", value: "Updated 2 months ago" },
    //     { icon: Shield, label: "Device Management", value: "2 devices active" },
    //   ]
    // },
    // {
    //   title: "Preferences",
    //   items: [
    //     { icon: Bell, label: "Notifications", value: "Push & Email" },
    //   ]
    // }
  ];

  return (
    <Layout>
      <div className="mx-auto space-y-8">
        <div>
          <p className="text-muted-foreground mt-1">
            <FormattedMessage id="settings.subtitle" />
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border bg-muted/20">
                <h3 className="font-display font-semibold text-lg text-foreground">
                  <FormattedMessage id={section.titleId} />
                </h3>
              </div>
              <div className="divide-y divide-border">
                {section.items.map((item, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center justify-between p-6 hover:bg-secondary/50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          <FormattedMessage id={item.labelId} />
                        </p>
                        {item.value && (
                          <p className="text-sm text-muted-foreground mt-0.5">{item.value}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-center">
          <button
            className="text-destructive font-medium hover:underline text-sm"
            onClick={handleSignOut}
          >
            <FormattedMessage id="settings.signout" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
