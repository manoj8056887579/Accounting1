import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

// Welcome Email Templates
import WelcomeEmailTemplate from './Emailtemplate/welcome/welcome1'
import Welcome2Template from './Emailtemplate/welcome/welcome2'
import Welcome3Template from './Emailtemplate/welcome/welcome3'

interface WelcomeEmailProps {
  selectedIndex?: number;
}

const WelcomeEmail = ({ selectedIndex = 0 }: WelcomeEmailProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<number>(selectedIndex)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')

  const templates = [
    {
      id: 'welcome1',
      title: 'Classic Welcome',
      component: <WelcomeEmailTemplate />
    },
    {
      id: 'welcome2',
      title: 'Modern Welcome',
      component: <Welcome2Template />
    },
    {
      id: 'welcome3',
      title: 'Premium Welcome',
      component: <Welcome3Template />
    }
  ]

  const openTemplateDialog = (index: number, title: string) => {
    setSelectedTemplate(index)
    setDialogTitle(title)
    setIsDialogOpen(true)
  }

  // Display the template based on card order in the Templates.tsx file
  // First card = Classic, Second card = Modern, Third card = Premium
  return (
    <div>
      {templates[selectedTemplate].component}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden border-none rounded-lg">
          <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200">
            <DialogTitle className="text-xl font-semibold text-gray-800">{dialogTitle}</DialogTitle>
            <button 
              onClick={() => setIsDialogOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>
          <div className="bg-white p-0">
            <div className="max-h-[calc(90vh-12rem)] overflow-y-auto">
              {templates[selectedTemplate].component}
            </div>
          </div>
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 px-5 py-2 h-10 font-medium"
            >
              Close
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 h-10 font-medium"
              variant="default"
            >
              Use This Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default WelcomeEmail 