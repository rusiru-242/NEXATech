import { useParams } from "react-router-dom";

function ProductDetails() {
	const { id } = useParams();

	return (
		<div className="min-h-screen bg-white text-gray-900">
			<div className="mx-auto max-w-4xl p-6">
				<h1 className="text-2xl font-bold">Product Details</h1>
				<p className="mt-4 text-sm text-gray-600">Product ID: {id || "(none)"}</p>
				<p className="mt-6 text-gray-500">This page is a placeholder for product details.</p>
			</div>
		</div>
	);
}

export default ProductDetails;
