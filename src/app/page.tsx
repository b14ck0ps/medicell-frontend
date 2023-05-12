"use client";
import React from 'react'
import ProductCard from './(customers)/ProductCard'
import withAuth from './withAuth';

function Homepage() {
  return (
    <div>
      <ProductCard />
    </div>
  )
}

export default withAuth(Homepage);