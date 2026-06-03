import { type Request, type Response } from "express";
export declare const getMessages: (req: Request, res: Response) => Promise<void>;
export declare const createMessage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addLike: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=messageController.d.ts.map