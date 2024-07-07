declare module "*.txt" {
	const content: string;
	export default content;
}

// Parcel's Node-like API for telling between development and production.
declare const process: { env: { NODE_ENV: string } };
