'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProductCard, Product } from './ProductCard'
type ApiProduct={slug:string;name:string;brand?:string;price:number;condition:string;category?:string;location?:string;image?:string}
export function CatalogPreview(){const[products,setProducts]=useState<Product[]>([]);useEffect(()=>{fetch('/api/products').then(r=>r.ok?r.json():Promise.reject()).then(j=>setProducts((j.products||[]).slice(0,4).map((p:ApiProduct)=>({slug:p.slug,name:p.name,brand:p.brand||'Tide & Trail',price:`$${Number(p.price).toFixed(2)}`,condition:p.condition,category:p.category||'Outdoor gear',location:p.location||'Moncton',image:p.image})))) .catch(()=>{})},[]);if(!products.length)return <div className="rounded-3xl bg-white p-7 text-forest/60">The Gear Room is preparing the next collection. <Link href="/newsletter" className="font-bold underline">Get the drop alert.</Link></div>;return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map(p=><ProductCard key={p.slug} p={p}/>)}</div>}
