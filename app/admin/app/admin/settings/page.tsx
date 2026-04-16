"use client"

import { useState } from "react"
import bcrypt from "bcryptjs"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const savePassword = async () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      setLoading(true)

      const hashedPassword = await bcrypt.hash(password, 10)

      const { error } = await supabase
        .from("admin_settings")
        .update({ password: hashedPassword })
        .eq("id", 1)

      if (error) {
        alert("Failed to update password")
        return
      }

      alert("Password updated successfully 🎉")
      setPassword("")
      setConfirmPassword("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            onClick={savePassword}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Saving..." : "Save Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
