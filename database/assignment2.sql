-- Insert Tony record
INSERT INTO public.account(
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'Tony@starkent.com',
	'Iam1ronM@an'
);


-- Update Tony account type to admin value
UPDATE public.account
SET 
	account_type = 'Admin'
WHERE 
	account_id = 1;


-- Delete Tony's row
DELETE FROM public.account
WHERE account_id = 1;


-- replace the description of the item id 10
UPDATE public.inventory
SET 
	inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE
	inv_id = 10;


-- select the make, model and classification field 
--from inventory and classification table
SELECT
	inv_make,
	inv_model,
	classification_name
FROM 
	public.inventory
INNER JOIN public.classification
	ON public.inventory.classification_id = public.classification.classification_id
WHERE 
	public.classification.classification_name = 'Sport';


--Replace columns with a new string including the word vehicles
UPDATE
	public.inventory
SET 
	inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');
	