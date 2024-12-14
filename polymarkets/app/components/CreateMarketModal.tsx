import React, { useState, useContext } from 'react';
import { PolyAppContext, BuyType } from '../context/PolyAppContext'; // Adjust import path as needed
import { Market } from "@/lib/types"; // Adjust import path as needed


export const CreateMarketButton = ({createMarket}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  return (
    <>
      <button 
        onClick={openModal}
        className="block text-white bg-[#1F2937] hover:bg-[#1f2937ad] font-medium rounded-lg text-sm px-5 py-3 text-center" 
        type="button"
      >
        Create Market
      </button>
      
      {isModalOpen && <CreateMarketModal onClose={() => setIsModalOpen(false)} createMarket={createMarket} />}
    </>
  )
}

interface CreateMarketModalProps {
  onClose: () => void;
  createMarket: (question: string, expiresAt: number) => void
}

export const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ onClose, createMarket }) => {

  // State for form inputs
  const [question, setQuestion] = useState('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createMarket(question, Math.floor(new Date(expirationDate).getTime() / 1000))

    // Create a new market object
    // const newMarket: Market = {
    //   id: Date.now().toString(), // Simple unique ID generation
    //   question: marketName,
    //   category,
    //   expiresAt: `${new Date(expirationDate)}`,
    //   views: 0,
    //   yesPercentage: 0,
    //   noPercentage: 0,
    //   volume: 0,
    //   icon: "",
    //   resolved: false,
    //   outcome: false,
    //   // Add other required fields based on your Market type
    // };

    // Update markets in context
    // setMarkets((prevMarkets: Market[]) => [...prevMarkets, newMarket]);

    // Reset form and close modal
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div 
      id="crud-modal" 
      className="fixed inset-0 z-50 flex justify-center items-center bg-[#1a2027] bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create New Market
            </h3>
            <CloseModalButton onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit} className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question</label>
                <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                  placeholder="Type market name" 
                  required 
                />
              </div>
              <DatePicker 
                value={expirationDate}
                onChange={(date) => setExpirationDate(date)}
              />
              <CategoryDropdown 
                value={category}
                onChange={(selectedCategory) => setCategory(selectedCategory)}
              />
              <FilePicker 
                file={file}
                onChange={handleFileChange}
              />
            </div>
            <button 
              type="submit" 
              className="text-white inline-flex items-center bg-[#1F2937] hover:bg-[#1f2937ad] outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
              Add new market
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

interface CloseModalButtonProps {
  onClick: () => void;
}

const CloseModalButton: React.FC<CloseModalButtonProps> = ({ onClick }) => {
  return (
    <button 
      type="button" 
      onClick={onClick}
      className="text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
    >
      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
      <span className="sr-only">Close modal</span>
    </button>
  )
}

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  return (
    <div className="col-span-2 sm:col-span-1">
      <label htmlFor="datepicker" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Expires At</label>
      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
        </svg>
      </div>
      <input
        id='datepicker' 
        type="date" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        placeholder="Expires at" 
        required
      />
    </div>
  )
}

interface CategoryDropdownProps {
  value: string;
  onChange: (category: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="col-span-2 sm:col-span-1">
      <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
      <select 
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        required
      >
        <option value="">Select category</option>
        <option value="TV">TV/Monitors</option>
        <option value="PC">PC</option>
        <option value="GA">Gaming/Console</option>
        <option value="PH">Phones</option>
      </select>
    </div>
  )
}

interface FilePickerProps {
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilePicker: React.FC<FilePickerProps> = ({ file, onChange }) => {
  return (
    <div className="flex items-center justify-center w-full col-span-2">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            {file ? file.name : <><span className="font-semibold">Click to upload</span> or drag and drop</>}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
        <input 
          id="dropzone-file" 
          type="file" 
          className="hidden" 
          onChange={onChange}
          accept="image/svg+xml,image/png,image/jpeg,image/gif"
        />
      </label>
    </div>
  )
}
