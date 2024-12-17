import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const EnterAmountModal = ({ 
  isOpen, 
  toggle, 
  onConfirm, 
  title = "Enter Amount", 
  description = "Please enter the amount you wish to proceed with.",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel"
}: {
  isOpen: boolean,
  toggle: () => void,
  onConfirm: ({amount}: {amount: string}) => Promise<void>,
  title: string,
  description: string,
  confirmButtonText: string,
  cancelButtonText: string
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    setAmount(sanitizedValue);
    setError('');
  };

  const validateAmount = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive number');
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    if (validateAmount()) {
      onConfirm({amount: amount});
      toggle();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              className="col-span-3"
              placeholder="Enter amount"
              type="text"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm ml-16">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={toggle}
          >
            {cancelButtonText}
          </Button>
          <Button 
            onClick={handleConfirm}
          >
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnterAmountModal;