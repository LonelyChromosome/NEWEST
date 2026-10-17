// Dựa trên DemoE/thuat_toan/ma_dich_vong.js và bộ tiện ích xử lý ký tự của DemoE/xu_ly_chinh.js.
// Z26: chỉ mã hóa A-Z/a-z; những ký tự không thuộc Z26 luôn được giữ nguyên.
const modulo = (x, n) => ((x % n) + n) % n;
function bien_doi_ky_tu(van_ban, ham_bien_doi_chi_so) {
  return Array.from(van_ban, ky_tu => {
    const ma = ky_tu.codePointAt(0);
    const co_so = ma >= 65 && ma <= 90 ? 65 : ma >= 97 && ma <= 122 ? 97 : null;
    if (co_so === null) return ky_tu;
    return String.fromCharCode(co_so + modulo(ham_bien_doi_chi_so(ma - co_so), 26));
  }).join("");
}
function lay_gia_tri_khoa(id) { return document.getElementById(id).value.trim(); }
function ma_dich_vong(van_ban, giai_ma = false) {
  const khoa_tho = lay_gia_tri_khoa("shiftKey");
  if (!/^[+-]?\\d+$/.test(khoa_tho)) throw new Error("Khóa dịch vòng phải là số nguyên.");
  const k = Number(khoa_tho);
  if (!Number.isSafeInteger(k)) throw new Error("Khóa nằm ngoài phạm vi số nguyên an toàn.");
  const do_dich = modulo(k, 26) * (giai_ma ? -1 : 1);
  return bien_doi_ky_tu(van_ban, chi_so => chi_so + do_dich);
}
const plain = document.getElementById("plainText"), cipher = document.getElementById("cipherText"), message = document.getElementById("message"), key = document.getElementById("shiftKey");
function run(decrypt) { try {const src = decrypt ? cipher : plain; if (!src.value) throw new Error("Hãy nhập chuỗi trước khi xử lý.");(decrypt ? plain : cipher).value = ma_dich_vong(src.value,decrypt);message.textContent=decrypt?"Giải mã thành công.":"Mã hóa thành công.";}catch(e){message.textContent=e.message;} }
document.getElementById("encryptButton").addEventListener("click",()=>run(false));
document.getElementById("decryptButton").addEventListener("click",()=>run(true));
document.getElementById("swapButton").addEventListener("click",()=>{[plain.value,cipher.value]=[cipher.value,plain.value];message.textContent="Đã đổi vị trí hai chuỗi.";});
document.getElementById("clearButton").addEventListener("click",()=>{plain.value="";cipher.value="";message.textContent="Đã xóa.";});
document.querySelectorAll("[data-key]").forEach(b=>b.addEventListener("click",()=>{key.value=b.dataset.key;document.querySelectorAll("[data-key]").forEach(x=>x.classList.toggle("active",x===b));}));
key.addEventListener("input",()=>document.querySelectorAll("[data-key]").forEach(x=>x.classList.toggle("active",x.dataset.key===key.value)));
