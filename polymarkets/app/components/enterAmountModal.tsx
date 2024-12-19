import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <DialogContent className='w-[90%] max-w-lg mx-auto sm:w-[80%] sm:max-w-md md:w-[60%] md:max-w-lg' >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col py-4">
          <div className="">
         
            <Input
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              className="col-span-3 py-6 text-center text-2xl font-bold  border-none focus:border-none"
              placeholder="0"
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
            className='bg-[#1a2027] text-white  border-none py-6'
          >
            {cancelButtonText}
          </Button>
          <Button 
            onClick={handleConfirm}
            className='bg-[#1F2937] text-white  mb-2 py-6'
            disabled={amount.trim() === '' || error !== '' || amount.trim() === '0'}
          >
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnterAmountModal;