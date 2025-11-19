import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://saohpkchezarbhkuernf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhb2hwa2NoZXphcmJoa3Vlcm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMjYwMjYsImV4cCI6MjA3NDgwMjAyNn0.YOUR_ANON_KEY_HERE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
async function submitContact(contact) {
  const { data, error } = await supabase.from("contacts").insert([contact]).select();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
async function submitStoreApplication(application) {
  const { data, error } = await supabase.from("store_applications").insert([application]).select();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
async function submitPressApplication(application) {
  const { data, error } = await supabase.from("press_applications").insert([application]).select();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export {
  submitContact,
  submitPressApplication,
  submitStoreApplication,
  supabase
};
//# sourceMappingURL=supabase-client.bundle.js.map
