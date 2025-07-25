// Generic CREATE
async function Create(model, data, res, text = "document", debug = false) {
	try {
		const doc = new model(data);
		const result = await doc.save();
		if(debug) console.log(`Successfully inserted ${text}.`, result)		
		res.status(200).json({ message: `Successfully inserted ${text}`, result });
	} catch (err) {
		console.error(`Error inserting ${text}.`, err);
		res.status(500).json({ message: `Error inserting ${text}`, error: err.message });
	}
}

// Generic READ
async function Read(model, res, text = "documents", query = {}, debug = false, projection = null, options = {}) {
	try {
		const result = await model.find(query, projection, options);
		if(debug) console.log(`Successfully read ${text}.`, result)
		res.status(200).json({ message: `Successfully read ${text}`, result });
	} catch (err) {
		console.error(`Error reading ${text}.`, err);
		res.status(500).json({ message: `Error reading ${text}`, error: err.message });
	}
}

// Generic READ by ID
async function ReadById(model, id, res, text = "document", debug = false) {
	try {
		const result = await model.findById(id);
		if (!result) {
			res.status(404).json({ message: `${text} not found` });
			return;
		}
		if(debug) console.log(`Successfully read ${text} by ID:`, result)
		res.status(200).json({ message: `Successfully read ${text}`, result });
	} catch (err) {
		console.error(`Error reading ${text} by ID:`, err);
		res.status(500).json({ message: `Error reading ${text}`, error: err.message });
	}
}

// Generic UPDATE
async function Update(model, id, updateData, res, text = "document", debug = false, options = { new: true }) {
	try {
		const result = await model.findByIdAndUpdate(id, updateData, options);
		if (!result) {
			res.status(404).json({ message: `${text} not found for update` });
			return;
		}
		if(debug) console.log(`Successfully updated ${text}.`, result)		
		res.status(200).json({ message: `Successfully updated ${text}`, result });
	} catch (err) {
		console.error(`Error updating ${text}.`, err);
		res.status(500).json({ message: `Error updating ${text}`, error: err.message });
	}
}

// Generic DELETE
async function Delete(model, id, res, text = "document", debug = false) {
	try {
		const result = await model.findByIdAndDelete(id);
		if (!result) {
			res.status(404).json({ message: `${text} not found for deletion` });
			return;
		}
		if(debug) console.log(`Successfully deleted ${text}.`, result)		
		res.status(200).json({ message: `Successfully deleted ${text}`, result });
	} catch (err) {
		console.error(`Error deleting ${text}.`, err);
		res.status(500).json({ message: `Error deleting ${text}`, error: err.message });
	}
}

function sanitizeBody(body, allowedFields) {
	const clean = {};
	for (let key of allowedFields) {
		if (body[key] !== undefined) clean[key] = body[key];
	}
	return clean;
}

module.exports = {
	Create,
	Read,
	ReadById,
	Update,
	Delete,
	sanitizeBody
};
