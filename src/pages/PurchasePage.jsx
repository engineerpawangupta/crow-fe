import { useRef } from 'react';
import { PresaleStats } from '@components/PresaleStats/PresaleStats';
import { PurchaseForm } from '@components/PurchaseForm/PurchaseForm';
import { Leaderboard } from '@components/Leaderboard/Leaderboard';
import { UserBalance } from '@components/UserBalance/UserBalance';

export const PurchasePage = () => {
  const purchaseFormRef = useRef(null);

  const scrollToPurchaseForm = () => {
    purchaseFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="container">
      <PresaleStats onBuyClick={scrollToPurchaseForm} />
      
      <div ref={purchaseFormRef}>
        <PurchaseForm />
      </div>
      
      <UserBalance />
      
      <Leaderboard />
    </div>
  );
};
