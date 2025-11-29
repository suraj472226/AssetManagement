import { useState, useEffect } from 'react';
import { Bell, Search, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockAssets, mockRequests } from '@/data/mockData';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      const query = searchQuery.toLowerCase();
      
      const assetResults = mockAssets
        .filter(asset => 
          asset.name.toLowerCase().includes(query) ||
          asset.assetID.toLowerCase().includes(query) ||
          asset.category.toLowerCase().includes(query) ||
          asset.currentOwner?.toLowerCase().includes(query)
        )
        .slice(0, 5)
        .map(asset => ({ ...asset, type: 'asset' }));

      const requestResults = mockRequests
        .filter(req => 
          req.assetType.toLowerCase().includes(query) ||
          req.employeeName.toLowerCase().includes(query)
        )
        .slice(0, 3)
        .map(req => ({ ...req, type: 'request' }));

      setSearchResults([...assetResults, ...requestResults]);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleResultClick = (result: any) => {
    if (result.type === 'asset') {
      navigate('/assets');
    } else if (result.type === 'request') {
      navigate('/requests');
    }
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 backdrop-blur-sm bg-card/95">
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets, requests..."
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
              />
            </div>
          </PopoverTrigger>
          {searchResults.length > 0 && (
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {searchResults.some(r => r.type === 'asset') && (
                    <CommandGroup heading="Assets">
                      {searchResults
                        .filter(r => r.type === 'asset')
                        .map((asset) => (
                          <CommandItem
                            key={asset.id}
                            onSelect={() => handleResultClick(asset)}
                            className="cursor-pointer"
                          >
                            <div className="flex flex-col gap-1">
                              <div className="font-medium">{asset.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {asset.assetID} • {asset.category} • {asset.status}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  )}
                  {searchResults.some(r => r.type === 'request') && (
                    <CommandGroup heading="Requests">
                      {searchResults
                        .filter(r => r.type === 'request')
                        .map((request) => (
                          <CommandItem
                            key={request.id}
                            onSelect={() => handleResultClick(request)}
                            className="cursor-pointer"
                          >
                            <div className="flex flex-col gap-1">
                              <div className="font-medium">{request.assetType}</div>
                              <div className="text-xs text-muted-foreground">
                                {request.employeeName} • {request.status}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          )}
        </Popover>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full"></span>
        </Button>

        <div className="hidden md:flex items-center gap-3 pl-4 border-l">
          <div className="text-right">
            <div className="text-sm font-medium">{user?.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
