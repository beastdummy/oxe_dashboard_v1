"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/useTranslation"
import { ActivityLog, eventConfig, EventType } from "@/lib/types/events"
import { AdminChat } from "@/components/AdminChat"
import { TicketsSection } from "@/components/TicketsSection"

export default function CommandCenterPage() {
  const t = useTranslation()
  return (
    <div className="p-6 space-y-6">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent Status Overview */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">{t.commandCenter.playersActive}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">190</div>
                <div className="text-xs text-neutral-500">{t.commandCenter.inAction}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">990</div>
                <div className="text-xs text-neutral-500">{t.commandCenter.disconnected}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">290</div>
                <div className="text-xs text-neutral-500">{t.commandCenter.newPlayers}</div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { id: "G-078W", band: "VENGEFUL SPIRIT", status: "active" },
                { id: "G-079X", band: "OBSIDIAN SENTINEL", status: "standby" },
                { id: "G-080Y", band: "GHOSTLY FURY", status: "active" },
                { id: "G-081Z", band: "CURSED REVENANT", status: "compromised" },
              ].map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        player.status === "active"
                          ? "bg-white"
                          : player.status === "standby"
                            ? "bg-neutral-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <div className="text-xs text-white font-mono">{player.id}</div>
                      <div className="text-xs text-neutral-500">{player.band}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">{t.commandCenter.activityLog}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {[
                {
                  id: "1",
                  timestamp: "03/01/2026 14:32",
                  type: "player_new" as EventType,
                  playerName: "G-156K",
                  message: t.events.player_new,
                },
                {
                  id: "2",
                  timestamp: "03/01/2026 13:45",
                  type: "band_created" as EventType,
                  bandName: "SHADOW SYNDICATE",
                  message: t.events.band_created,
                },
                {
                  id: "3",
                  timestamp: "03/01/2026 12:10",
                  type: "player_joined" as EventType,
                  playerName: "G-078W",
                  bandName: "VENGEFUL SPIRIT",
                  message: t.events.player_joined,
                },
                {
                  id: "4",
                  timestamp: "02/01/2026 23:55",
                  type: "player_promoted" as EventType,
                  playerName: "G-079X",
                  bandName: "OBSIDIAN SENTINEL",
                  message: t.events.player_promoted,
                },
                {
                  id: "5",
                  timestamp: "02/01/2026 18:20",
                  type: "player_connected" as EventType,
                  playerName: "G-080Y",
                  message: t.events.player_connected,
                },
                {
                  id: "6",
                  timestamp: "01/01/2026 15:30",
                  type: "band_deleted" as EventType,
                  bandName: "FORGOTTEN CREW",
                  message: t.events.band_deleted,
                },
                {
                  id: "7",
                  timestamp: "01/01/2026 10:15",
                  type: "player_left" as EventType,
                  playerName: "G-081Z",
                  bandName: "CURSED REVENANT",
                  message: t.events.player_left,
                },
              ].map((log) => {
                const config = eventConfig[log.type]
                return (
                  <div
                    key={log.id}
                    className="text-xs border-l-2 border-l-orange-500 pl-3 hover:bg-neutral-800 p-2 rounded transition-colors"
                  >
                    <div className="text-neutral-500 font-mono text-xs">{log.timestamp}</div>
                    <div className="text-white flex items-center gap-2 mt-1">
                      <span className="font-bold text-orange-500">{config.icon}</span>
                      <span>
                        {log.playerName && <span className="font-mono text-orange-500">{log.playerName}</span>}
                        <span className="ml-1 text-white">{log.message}</span>
                        {log.bandName && <span className="font-mono text-orange-500 ml-1">{log.bandName}</span>}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Encrypted Chat Activity */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700 flex flex-col h-96">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              ADMIN CHAT
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col overflow-hidden">
            <AdminChat />
          </CardContent>
        </Card>

        {/* Player Activity Chart */}
        <Card className="lg:col-span-8 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              PLAYER ACTIVITY OVERVIEW
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Legend */}
              <div className="flex gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-orange-500"></div>
                  <span className="text-neutral-400">Jugadores Activos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-white" style={{ backgroundImage: "repeating-linear-gradient(90deg, white 0px, white 4px, transparent 4px, transparent 8px)" }}></div>
                  <span className="text-neutral-400">Jugadores Registrados</span>
                </div>
              </div>

              {/* Chart */}
              <div className="h-48 relative">
                {/* Chart Grid */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="border border-neutral-700"></div>
                  ))}
                </div>

                {/* Chart Lines */}
                <svg className="absolute inset-0 w-full h-full">
                  {/* Activos (naranja) - línea inferior */}
                  <polyline
                    points="0,120 50,100 100,110 150,90 200,95 250,85 300,100 350,80"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                  />
                  {/* Registrados (blanca) - línea superior */}
                  <polyline
                    points="0,70 50,60 100,65 150,50 200,55 250,45 300,60 350,40"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                </svg>

                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-neutral-500 -ml-5 font-mono">
                  <span>1000</span>
                  <span>800</span>
                  <span>600</span>
                  <span>400</span>
                  <span>200</span>
                  <span>0</span>
                </div>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-neutral-500 -mb-6 font-mono">
                  <span>28/12/2025</span>
                  <span>03/01/2026</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Alerts */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">SECURITY ALERTS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-red-500 font-medium">Critical</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Jugadores Baneados</span>
                    <span className="text-white font-bold font-mono">23</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Bandas en Infracción</span>
                    <span className="text-white font-bold font-mono">7</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Intentos de Hack</span>
                    <span className="text-white font-bold font-mono">12</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-yellow-500 font-medium">Pending</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Reportes Pendientes</span>
                    <span className="text-white font-bold font-mono">34</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Investigaciones</span>
                    <span className="text-white font-bold font-mono">5</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Advertencias Activas</span>
                    <span className="text-white font-bold font-mono">18</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Section */}
      <div className="mt-6">
        <TicketsSection />
      </div>
    </div>
  )
}
