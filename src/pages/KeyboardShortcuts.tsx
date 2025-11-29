import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function KeyboardShortcuts() {
  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { action: 'Open universal search', keys: ['Ctrl', 'Shift', 'F'] },
        { action: 'Dashboard', keys: ['A'] },
        { action: 'Orders', keys: ['O'] },
        { action: 'Holdings', keys: ['H'] },
        { action: 'Positions', keys: ['P'] },
        { action: 'Funds', keys: ['F'] },
        { action: 'Profile', keys: ['I'] },
        { action: 'Edit Profile', keys: ['J'] },
        { action: 'Keyboard Shortcuts', keys: ['/', '?'] },
      ]
    },
    {
      category: 'Watchlists',
      items: [
        { action: 'Focus on watchlist search', keys: ['~', 'or', 'Ctrl', 'K'] },
        { action: 'Open watchlist selector popup', keys: ['Ctrl', 'Shift', 'K'] },
        { action: 'Switch favorite watchlist', keys: ['Ctrl', 'Shift', '1 to 7'] },
        { action: 'Cycle through instruments', keys: ['↑↓'] },
        { action: 'Buy instrument', keys: ['B'] },
        { action: 'Sell instrument', keys: ['S'] },
        { action: 'Open market depth', keys: ['D'] },
        { action: 'Open chart', keys: ['C'] },
        { action: 'Add note', keys: ['N'] },
        { action: 'Delete instrument', keys: ['Del'] },
        { action: 'Collapse/expand group', keys: ['Space'] },
        { action: 'Maximize/restore group', keys: ['Shift', 'Space'] },
      ]
    },
    {
      category: 'Popout Chart',
      items: [
        { action: 'Buy opened chart instrument', keys: ['B'] },
        { action: 'Sell opened chart instrument', keys: ['S'] },
        { action: 'Toggle quick trade drawer', keys: ['Ctrl', 'Shift', 'Z'] },
      ]
    }
  ];

  return (
    <div className="min-h-screen" style={{ paddingTop: '120px', backgroundColor: 'white' }}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Keyboard Shortcuts</h1>
          <p className="text-gray-600 mt-2">Speed up your trading with keyboard shortcuts</p>
        </div>

        <div className="space-y-6">
          {shortcuts.map((section) => (
            <Card key={section.category} className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{section.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700">{item.action}</span>
                      <div className="flex items-center gap-1">
                        {item.keys.map((key, keyIndex) => (
                          <span key={keyIndex}>
                            {key === 'or' ? (
                              <span className="text-xs text-gray-400 mx-1">or</span>
                            ) : key === '~' || key === '/' || key === '?' || key === '↑↓' ? (
                              <kbd className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded">
                                {key}
                              </kbd>
                            ) : (
                              <kbd className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded">
                                {key}
                              </kbd>
                            )}
                            {keyIndex < item.keys.length - 1 && item.keys[keyIndex + 1] !== 'or' && key !== 'or' && (
                              <span className="text-gray-400 mx-0.5">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Tip */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Press <kbd className="px-2 py-1 text-xs font-semibold text-blue-600 bg-white border border-blue-300 rounded mx-1">/</kbd> or <kbd className="px-2 py-1 text-xs font-semibold text-blue-600 bg-white border border-blue-300 rounded mx-1">?</kbd> anytime to view this shortcuts page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
