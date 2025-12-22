"use client";
import { useParams } from "next/navigation";
import React from "react";

export default function ExhibitionDetails() {
  const params = useParams();
  return <div>개인 전시 {params.id}</div>;
}
