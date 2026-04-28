import React from 'react';
import { ArrowLeft, Wrench, CircleDashed, Zap, Car as CarIcon } from 'lucide-react';
import { Inventory, PERFORMANCE_PARTS, CAR_MODELS, CarModelType } from '../types';
import { getCarAssetForModel } from '../utils/carSpriteLoader';

interface StoreProps {
  money: number;
  setMoney: (money: number) => void;
  inventory: Inventory;
  setInventory: (inv: Inventory) => void;
  onBack: () => void;
}

export default function Store({ money, setMoney, inventory, setInventory, onBack }: StoreProps) {
  type PartInventoryKey = 'engines' | 'turbos' | 'tires';
  const getInventoryKey = (category: keyof typeof PERFORMANCE_PARTS): PartInventoryKey => {
    if (category === 'engine') return 'engines';
    if (category === 'turbo') return 'turbos';
    return 'tires';
  };

  const handleBuy = (category: keyof typeof PERFORMANCE_PARTS, level: number, price: number) => {
    const invKey = getInventoryKey(category);
    if (money >= price && !inventory[invKey].includes(level)) {
      setMoney(money - price);
      setInventory({
        ...inventory,
        [invKey]: [...inventory[invKey], level].sort((a, b) => a - b)
      });
    }
  };

  const handleBuyCar = (model: CarModelType, price: number) => {
    if (inventory.cars.includes(model)) return;
    if (money < price) return;
    setMoney(money - price);
    setInventory({
      ...inventory,
      cars: [...inventory.cars, model],
    });
  };

  const renderPartList = (category: keyof typeof PERFORMANCE_PARTS, icon: React.ReactNode, title: string) => {
    const invKey = getInventoryKey(category);
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="p-3 bg-zinc-800 rounded-full text-cyan-400">
            {icon}
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">{title}</h2>
        </div>
        
        <div className="flex flex-col gap-3">
          {PERFORMANCE_PARTS[category].map((part) => {
            const isOwned = inventory[invKey].includes(part.level);
            const canAfford = money >= part.price;
            
            return (
              <div key={part.level} className={`flex items-center justify-between p-4 rounded-md border ${isOwned ? 'bg-emerald-900/20 border-emerald-900/50' : 'bg-black/40 border-zinc-800'}`}>
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{part.name}</span>
                  <span className="text-xs text-zinc-400 uppercase tracking-wider">
                    Level {part.level} {part.boost ? `(+${part.boost} Speed)` : part.grip ? `(+${part.grip} Grip)` : `(+${part.accel} Accel)`}
                  </span>
                </div>
                
                {isOwned ? (
                  <div className="px-4 py-2 bg-emerald-900/40 text-emerald-400 font-bold rounded-sm text-sm uppercase tracking-wider border border-emerald-800">
                    Owned
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuy(category, part.level, part.price)}
                    disabled={!canAfford}
                    className={`px-6 py-2 font-bold rounded-sm text-sm uppercase tracking-wider transition-colors ${
                      canAfford 
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white' 
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    ${part.price.toLocaleString()}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 text-white flex flex-col overflow-hidden overflow-y-auto">
      {/* Header */}
      <div className="p-4 md:p-6 flex items-center justify-between border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase font-bold tracking-widest text-[10px] md:text-sm">Menu</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter text-cyan-400">Parts Store</h1>
          <p className="hidden sm:block text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Upgrade your performance</p>
        </div>

        <div className="bg-zinc-900 px-3 py-1 md:px-4 md:py-2 rounded-sm border border-zinc-800">
          <span className="text-emerald-400 font-mono font-bold text-sm md:text-base">${money.toLocaleString()}</span>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6 md:gap-8">
        {/* Cars Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="p-3 bg-zinc-800 rounded-full text-cyan-400">
              <CarIcon size={24} />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Chassis Dealership</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(CAR_MODELS) as CarModelType[]).map((model) => {
              const info = CAR_MODELS[model];
              const isOwned = inventory.cars.includes(model);
              const price = info.price ?? 0;
              const canAfford = money >= price;

              return (
                <div
                  key={model}
                  className={`flex flex-col rounded-md border overflow-hidden ${
                    isOwned
                      ? 'bg-emerald-900/20 border-emerald-900/50'
                      : 'bg-black/40 border-zinc-800'
                  }`}
                >
                  <div className="aspect-[4/3] bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center p-3">
                    <img
                      src={getCarAssetForModel(model)}
                      alt={info.name}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <span className="font-black italic uppercase tracking-tight text-xl">{info.name}</span>
                    <p className="text-xs text-zinc-400 flex-1">{info.description}</p>
                    <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest text-zinc-500">
                      {Object.entries(info.stats).map(([stat, val]) => (
                        <span key={stat}>
                          {stat}: <span className="text-cyan-400 font-bold">{val}</span>
                        </span>
                      ))}
                    </div>
                    {isOwned ? (
                      <div className="mt-2 px-4 py-2 bg-emerald-900/40 text-emerald-400 font-bold rounded-sm text-sm uppercase tracking-wider border border-emerald-800 text-center">
                        Owned
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuyCar(model, price)}
                        disabled={!canAfford}
                        className={`mt-2 px-4 py-2 font-bold rounded-sm text-sm uppercase tracking-wider transition-colors ${
                          canAfford
                            ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        ${price.toLocaleString()}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Parts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {renderPartList('engine', <Wrench size={24} />, 'Engine Upgrades')}
          {renderPartList('tires', <CircleDashed size={24} />, 'Tire Compounds')}
          {renderPartList('turbo', <Zap size={24} />, 'Turbochargers')}
        </div>
      </div>
    </div>
  );
}
