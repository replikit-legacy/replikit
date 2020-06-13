export interface AttachmentId {
    controller?: string;
    localId: string;
}

export interface AttachmentSource {
    controller: string;
    localId: string;
    uploadId?: string;
}

export interface Attachment {
    _id: AttachmentId;
    sources: AttachmentSource[];
}
