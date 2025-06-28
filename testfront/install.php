<?php
require_once(__DIR__ . '/crest.php');

$result = CRest::installApp();

if (isset($result['rest_only']) && $result['rest_only'] === false): ?>
	<!DOCTYPE html>
	<html lang="en">

	<head>
		<meta charset="UTF-8">
		<title>App Installation</title>
		<script src="//api.bitrix24.com/api/v1/"></script>
		<?php if (isset($result['install']) && $result['install'] === true): ?>
			<script>
				BX24.init(function () {
					BX24.installFinish();
				});
			</script>
		<?php endif; ?>
	</head>

	<body>
		<?php if (isset($result['install'])): ?>
			<?php if ($result['install'] === true): ?>
				<p>Installation has been finished</p>
			<?php else: ?>
				<p>Installation error</p>
			<?php endif; ?>
		<?php else: ?>
			<p>Invalid installation response</p>
		<?php endif; ?>
	</body>

	</html>
<?php endif; ?>