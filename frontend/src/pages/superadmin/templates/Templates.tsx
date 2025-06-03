import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X, Check, Crown, ArrowRight, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

import WelcomeEmail from './WelcomeEmailTemplate'
import { InvoiceTemplate } from './InvoiceTemplate'

interface TemplateItem {
  id: string;
  title: string;
  description: string;
  tag: string;
}

const Templates = () => {
  const [activeTab, setActiveTab] = useState('welcome-email')
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const openTemplateDialog = (index: number, title: string, id: string) => {
    setSelectedTemplateIndex(index)
    setDialogTitle(title)
    setIsDialogOpen(true)
  }

  const selectTemplate = (id: string) => {
    setSelectedTemplate(id)
  }

  const welcomeTemplates: TemplateItem[] = [
    {
      id: 'welcome1',
      title: 'Classic Welcome',
      description: 'A professional and clean welcome email template',
      tag: 'Popular',
    },
    {
      id: 'welcome2',
      title: 'Modern Welcome',
      description: 'A modern template with feature highlights',
      tag: 'New',
    },
    {
      id: 'welcome3',
      title: 'Premium Welcome',
      description: 'A premium welcome email with detailed steps',
      tag: 'Premium',
    }
  ]

  const invoiceTemplates: TemplateItem[] = [
    {
      id: 'invoice1',
      title: 'Standard Invoice',
      description: 'A clean, professional invoice template',
      tag: 'Classic',
    },
    {
      id: 'invoice2',
      title: 'Modern Invoice',
      description: 'A modern invoice with sleek design',
      tag: 'Trending',
    },
    {
      id: 'invoice3',
      title: 'Premium Invoice',
      description: 'A premium invoice template with detailed sections',
      tag: 'Premium',
    }
  ]

  const getTagColor = (tag: string) => {
    switch(tag.toLowerCase()) {
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'popular': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'new': return 'bg-green-100 text-green-800 border-green-200';
      case 'trending': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full justify-start rounded-none p-0">
          <TabsTrigger 
            value="welcome-email" 
            className={`rounded-none px-8 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent ${activeTab === 'welcome-email' ? 'font-semibold text-blue-600' : 'text-gray-500'}`}
          >
            Welcome Email
          </TabsTrigger>
          <TabsTrigger 
            value="invoice" 
            className={`rounded-none px-8 py-3 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent ${activeTab === 'invoice' ? 'font-semibold text-blue-600' : 'text-gray-500'}`}
          >
            Invoices
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="welcome-email" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {welcomeTemplates.map((template, index) => (
              <Card 
                key={template.id}
                className={`overflow-hidden border ${selectedTemplate === template.id ? 'border-indigo-600 ring-2 ring-indigo-600 ring-opacity-50' : 'border-gray-200'} rounded-lg shadow-sm hover:shadow-lg transition-all duration-300`}
                onMouseEnter={() => setHoveredCard(template.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`relative ${hoveredCard === template.id ? 'bg-indigo-50' : 'bg-white'} transition-colors duration-300`}>
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className={`border px-2 py-1 text-xs font-medium ${getTagColor(template.tag)}`}>
                      {template.tag}
                    </Badge>
                  </div>
                  
                  {selectedTemplate === template.id && (
                    <div className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white shadow-md">
                      <Check size={16} />
                    </div>
                  )}
                  
                  <div className="h-[280px] overflow-hidden relative border-b border-gray-200">
                    <div className="absolute inset-0 bg-white overflow-hidden scale-[0.65] pointer-events-none">
                      <WelcomeEmail selectedIndex={index} />
                    </div>
                    
                    {hoveredCard === template.id && (
                      <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                        <Button 
                          onClick={() => openTemplateDialog(index, template.title, template.id)}
                          className="bg-white hover:bg-gray-50 text-gray-800 hover:text-gray-800 shadow-lg flex items-center gap-2"
                          variant="outline"
                        >
                          <Eye size={16} />
                          Preview
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        {template.title}
                        {template.tag === 'Premium' && (
                          <Crown size={16} className="text-amber-500" />
                        )}
                      </h3>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">{template.description}</p>
                    <Button 
                      onClick={() => selectTemplate(template.id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                      variant="default"
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="invoice" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {invoiceTemplates.map((template, index) => (
              <Card 
                key={template.id}
                className={`overflow-hidden border ${selectedTemplate === template.id ? 'border-indigo-600 ring-2 ring-indigo-600 ring-opacity-50' : 'border-gray-200'} rounded-lg shadow-sm hover:shadow-lg transition-all duration-300`}
                onMouseEnter={() => setHoveredCard(template.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`relative ${hoveredCard === template.id ? 'bg-indigo-50' : 'bg-white'} transition-colors duration-300`}>
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className={`border px-2 py-1 text-xs font-medium ${getTagColor(template.tag)}`}>
                      {template.tag}
                    </Badge>
                  </div>
                  
                  {selectedTemplate === template.id && (
                    <div className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white shadow-md">
                      <Check size={16} />
                    </div>
                  )}
                  
                  <div className="h-[280px] overflow-hidden relative border-b border-gray-200">
                    <div className="absolute inset-0 bg-white overflow-hidden scale-[0.65]  pointer-events-none">
                      <InvoiceTemplate selectedIndex={index} />
                    </div>
                    
                    {hoveredCard === template.id && (
                      <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                        <Button 
                          onClick={() => openTemplateDialog(index, template.title, template.id)}
                          className="bg-white hover:bg-gray-50 text-gray-800 hover:text-gray-800 shadow-lg flex items-center gap-2"
                          variant="outline"
                        >
                          <Eye size={16} />
                          Preview
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        {template.title}
                        {template.tag === 'Premium' && (
                          <Crown size={16} className="text-amber-500" />
                        )}
                      </h3>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">{template.description}</p>
                    <Button 
                      onClick={() => selectTemplate(template.id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                      variant="default"
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden border-none rounded-lg shadow-2xl">
          <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200">
            <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              {dialogTitle}
              {(dialogTitle.includes('Premium') || activeTab === 'invoice' && selectedTemplateIndex === 2 || activeTab === 'welcome-email' && selectedTemplateIndex === 2) && (
                <Crown size={18} className="text-amber-500" />
              )}
            </DialogTitle>
           
          </div>
          <div className="bg-white p-0">
            <div className="max-h-[calc(90vh-12rem)] overflow-y-auto">
              {activeTab === 'welcome-email' ? (
                <WelcomeEmail selectedIndex={selectedTemplateIndex} />
              ) : (
                <InvoiceTemplate selectedIndex={selectedTemplateIndex} />
              )}
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
              onClick={() => {
                const templates = activeTab === 'welcome-email' ? welcomeTemplates : invoiceTemplates;
                selectTemplate(templates[selectedTemplateIndex].id);
                setIsDialogOpen(false);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 h-10 font-medium flex items-center"
              variant="default"
            >
              Use This Template
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Templates
