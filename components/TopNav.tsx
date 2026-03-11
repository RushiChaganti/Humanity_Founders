"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function TopNav() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-6">
                <Link href="/console/admin" className="flex items-center gap-3">
                    <Image
                        src="/hf-logo.png"
                        alt="Humanity Founders Logo"
                        width={40}
                        height={40}
                        className="rounded-xl"
                        priority
                    />
                    <div>
                        <h2 className="text-foreground font-black tracking-tight leading-none uppercase text-sm">Humanity</h2>
                        <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase mt-1">Founders Console</p>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    <Link href="/console/builder">
                        <Button size="sm" className="h-9 gap-2 bg-primary text-primary-foreground hover:opacity-90 transition-all rounded-full font-bold text-xs">
                            Build <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                    </Link>
                    <Link href="/console/admin">
                        <Button size="sm" variant="outline" className="h-9 bg-muted/50 border-border backdrop-blur-md hover:bg-muted transition-all rounded-full font-bold text-xs">
                            Console
                        </Button>
                    </Link>
                    {/* Theme switch removed as per user request */}
                </div>
            </div>
        </nav>
    )
}
