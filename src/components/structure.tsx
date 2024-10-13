import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle } from 'lucide-react'

interface Category {
    id: string;
    name: string;
    fieldId: string;
    fieldName: string;
    subcategories: Category[];
}

export default function CategoryHierarchy() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [submittedData, setSubmittedData] = useState<Category[]>([]);

    const addCategory = (parentId: string | null = null) => {
        const newCategory: Category = {
            id: Date.now().toString(),
            name: '',
            fieldId: `field_${Date.now()}`,
            fieldName: '',
            subcategories: []
        };
        if (parentId === null) {
            setCategories([...categories, newCategory]);
        } else {
            setCategories(updateCategories(categories, parentId, newCategory));
        }
    };

    const updateCategories = (cats: Category[], id: string, newCat: Category): Category[] => {
        return cats.map(cat => {
            if (cat.id === id) {
                return { ...cat, subcategories: [...cat.subcategories, newCat] };
            }
            if (cat.subcategories.length > 0) {
                return { ...cat, subcategories: updateCategories(cat.subcategories, id, newCat) };
            }
            return cat;
        });
    };

    const handleInputChange = (id: string, field: 'name' | 'fieldName', value: string) => {
        setCategories(updateCategoryField(categories, id, field, value));
    };

    const updateCategoryField = (cats: Category[], id: string, field: 'name' | 'fieldName', value: string): Category[] => {
        return cats.map(cat => {
            if (cat.id === id) {
                return { ...cat, [field]: value };
            }
            if (cat.subcategories.length > 0) {
                return { ...cat, subcategories: updateCategoryField(cat.subcategories, id, field, value) };
            }
            return cat;
        });
    };

    const renderCategoryInputs = (category: Category, depth: number = 0) => {
        return (
            <div key={category.id} className="ml-4 mt-2">
                <div className="flex items-center gap-2 mb-2">
                    <Input
                        type="text"
                        value={category.name}
                        onChange={(e) => handleInputChange(category.id, 'name', e.target.value)}
                        placeholder={`Category ${depth + 1}`}
                        className="w-64"
                    />
                    <Input
                        type="text"
                        value={category.fieldName}
                        onChange={(e) => handleInputChange(category.id, 'fieldName', e.target.value)}
                        placeholder="Field Name"
                        className="w-64"
                    />
                    <Button onClick={() => addCategory(category.id)} size="sm">
                        <PlusCircle className="w-4 h-4 mr-2" /> Add Subcategory
                    </Button>
                </div>
                {category.subcategories.map(subcat => renderCategoryInputs(subcat, depth + 1))}
            </div>
        );
    };

    const handleSubmit = () => {
        setSubmittedData(categories);
    };

    const renderCategoryTable = (categories: Category[]) => {
        return (
            categories.map(cat => {
                <h1>{cat.fieldName}</h1>
            })
        )
        // )categories.map(category => [
        //     <tr key={category.id}>
        //         <td className="px-4 py-2 font-semibold" style={{ paddingLeft: `${depth * 20}px` }}>
        //             {category.name}
        //         </td>
        //         <td className="px-4 py-2">
        //             {category.fieldName}
        //         </td>
        //         <td className="px-4 py-2">
        //             {category.fieldId}
        //         </td>
        //     </tr>,
        //     ...renderCategoryTable(category.subcategories, depth + 1)
        // ]);
    };

    return (
        <div className="p-4">
            <Button onClick={() => addCategory()} className="mb-4">ADD Category</Button>
            <div className="mb-4">
                {categories.map(category => renderCategoryInputs(category))}
            </div>
            <Button onClick={handleSubmit} className="mb-4">Submit</Button>
            {submittedData.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 bg-gray-100 text-left">Categories</th>
                                <th className="px-4 py-2 bg-gray-100 text-left">Field Name</th>
                                <th className="px-4 py-2 bg-gray-100 text-left">Field ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderCategoryTable(submittedData)}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}