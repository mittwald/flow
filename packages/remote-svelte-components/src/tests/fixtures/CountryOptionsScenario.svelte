<script lang="ts">
  import Label from "../../auto-generated/Label.svelte";
  import Select from "../../auto-generated/Select.svelte";
  import CountryOptions from "../../components/CountryOptions.svelte";
</script>

<Select name="country"><Label>Homeworld</Label><CountryOptions
    filterBy={(country) => ["DE", "FR", "US"].includes(country.code)}
  /></Select>
