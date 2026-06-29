"use client"

import { useRef, useState, useEffect } from "react"

type UploadFile = {
    file: File
    id: string
    progress: number
    uploaded: boolean
    directusId?: string
    error?: boolean
}

type Props = {
    locale?: "fa" | "en"
    maxSizeMB?: number
    onUploaded?: (ids: string[]) => void
}

const ACCEPT = ".png,.jpg,.jpeg,.webp,.pdf,.3dm,.stl,.zip"

export default function UploadZone({
    locale = "en",
    maxSizeMB = 20,
    onUploaded,
}: Props) {

    const inputRef = useRef<HTMLInputElement>(null)

    const [files, setFiles] = useState<UploadFile[]>([])
    const [dragCount, setDragCount] = useState(0)

    const isFa = locale === "fa"
    const MAX_SIZE = maxSizeMB * 1024 * 1024

    const openDialog = () => inputRef.current?.click()

    const isDuplicate = (file: File) =>
        files.some(
            f =>
                f.file.name === file.name &&
                f.file.size === file.size
        )

    const getIcon = (file: File) => {

        const name = file.name.toLowerCase()

        if (file.type.startsWith("image/")) return "🖼️"
        if (name.endsWith(".pdf")) return "📄"
        if (name.endsWith(".zip")) return "🗜️"
        if (name.endsWith(".stl")) return "🧊"
        if (name.endsWith(".3dm")) return "📐"

        return "📁"
    }

    // ---------------------------------------
    // ✔ Update parent *only when files change*
    // ---------------------------------------
    useEffect(() => {
        if (!onUploaded) return

        const ids = files
            .filter(f => f.directusId)
            .map(f => f.directusId!)

        onUploaded(ids)
    }, [files, onUploaded])


    // ---------------------------------------
    // Upload a single file to Directus
    // ---------------------------------------
    const uploadFile = (uploadFile: UploadFile) => {

        const formData = new FormData()
        formData.append("file", uploadFile.file)

        const xhr = new XMLHttpRequest()

        xhr.upload.onprogress = e => {
            if (!e.lengthComputable) return

            const percent = Math.round((e.loaded / e.total) * 100)

            setFiles(prev =>
                prev.map(f =>
                    f.id === uploadFile.id
                        ? { ...f, progress: percent }
                        : f
                )
            )
        }

        xhr.onload = () => {
            try {
                if (xhr.status < 200 || xhr.status >= 300) {
                    throw new Error("Upload failed")
                }

                const res = JSON.parse(xhr.response)
                const directusId = res?.data?.id

                if (!directusId) throw new Error("Missing Directus ID")

                setFiles(prev =>
                    prev.map(f =>
                        f.id === uploadFile.id
                            ? {
                                ...f,
                                uploaded: true,
                                progress: 100,
                                directusId,
                                error: false,
                            }
                            : f
                    )
                )

            } catch (err) {
                console.error(err)

                setFiles(prev =>
                    prev.map(f =>
                        f.id === uploadFile.id
                            ? { ...f, error: true }
                            : f
                    )
                )
            }
        }

        xhr.onerror = () => {
            setFiles(prev =>
                prev.map(f =>
                    f.id === uploadFile.id
                        ? { ...f, error: true }
                        : f
                )
            )
        }

        xhr.open(
            "POST",
            `/api/atelier-dashboard/files/upload`
        )

        xhr.send(formData)
    }

    // ---------------------------------------
    // Handle selecting files
    // ---------------------------------------
    const processFiles = (fileList: FileList | null) => {
        if (!fileList) return

        const newFiles = Array.from(fileList)

        const valid = newFiles.filter(file => {
            if (file.size > MAX_SIZE) {
                alert(`${file.name} too large`)
                return false
            }
            if (isDuplicate(file)) return false
            return true
        })

        const uploads: UploadFile[] = valid.map(file => ({
            file,
            id: crypto.randomUUID(),
            progress: 0,
            uploaded: false,
        }))

        setFiles(prev => [...prev, ...uploads])

        uploads.forEach(uploadFile)
    }


    // ---------------------------------------
    // Remove a file
    // ---------------------------------------
    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id))
    }


    // ---------------------------------------
    // Drag & Drop
    // ---------------------------------------
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragCount(0)
        processFiles(e.dataTransfer.files)
    }

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        setDragCount(c => c + 1)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDragCount(c => Math.max(0, c - 1))
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const dragging = dragCount > 0

    // ---------------------------------------
    // Render UI
    // ---------------------------------------
    return (
        <div className="space-y-5">

            <div
                onClick={openDialog}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border border-dashed rounded-xl p-10 text-center cursor-pointer transition
                ${dragging
                        ? "border-white bg-white/5"
                        : "border-white/20 hover:border-white/40"
                    }`}
            >

                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={ACCEPT}
                    className="hidden"
                    onChange={e => processFiles(e.target.files)}
                />

                <div className="text-white text-sm mb-2">
                    {isFa
                        ? "فایل را اینجا رها کنید یا کلیک کنید"
                        : "Drag & drop files or click to upload"}
                </div>

                <div className="text-white/40 text-xs">
                    JPG PNG WEBP PDF STL 3DM ZIP
                </div>
            </div>

            {files.length > 0 && (
                <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
                    {files.map(item => (
                        <div
                            key={item.id}
                            className="border border-white/10 rounded-lg p-3 text-xs text-white relative bg-white/[0.02]"
                        >
                            {item.file.type.startsWith("image/") ? (
                                <img
                                    src={URL.createObjectURL(item.file)}
                                    className="w-full h-24 object-cover rounded mb-2"
                                />
                            ) : (
                                <div className="h-24 flex items-center justify-center text-3xl mb-2">
                                    {getIcon(item.file)}
                                </div>
                            )}

                            <div className="truncate">
                                {item.file.name}
                            </div>

                            <div className="text-white/40 text-[10px]">
                                {(item.file.size / 1024 / 1024).toFixed(2)} MB
                            </div>

                            <div className="w-full bg-white/10 h-1 mt-2 rounded">
                                <div
                                    className={`h-1 rounded transition-all ${item.error
                                        ? "bg-red-500"
                                        : item.uploaded
                                            ? "bg-green-500"
                                            : "bg-white"
                                        }`}
                                    style={{ width: `${item.progress}%` }}
                                />
                            </div>

                            <div className="mt-2 text-[10px]">
                                {item.error && (
                                    <span className="text-red-400">Upload failed</span>
                                )}
                                {!item.error && item.uploaded && (
                                    <span className="text-green-400">Uploaded</span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => removeFile(item.id)}
                                className="absolute top-1 right-1 text-white/40 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

