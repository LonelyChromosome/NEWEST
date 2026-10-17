
#include <iostream>
#include <string>
using namespace std;
const string bangMa = "abcdefghijklmnopqrstuvwxyz@.-";
string dichVong(string chuoi, int k, bool giaiMa = false) {
    string ketQua = "";
    int n = bangMa.length();
    if (giaiMa) k = -k;
    for (char c : chuoi) {
        char kyTu = c;
        if (kyTu >= 'A' && kyTu <= 'Z')
            kyTu = kyTu + 32;
        size_t viTri = bangMa.find(kyTu);
        if (viTri != string::npos) {
            int viTriMoi = ((int(viTri) + k) % n + n) % n;
            ketQua += bangMa[viTriMoi];
        } else {
            ketQua += c;
        }
    }
    return ketQua;
}
int main() {
    string banRo;
    int k = 17;
    cout << "Nhap chuoi can ma hoa: ";
    getline(cin, banRo);
    string banMa = dichVong(banRo, k);
    string giaiMa = dichVong(banMa, k, true);
    cout << "\nKhoa: " << k << endl;
    cout << "Ban ro: " << banRo << endl;
    cout << "Ban ma: " << banMa << endl;
    cout << "Giai ma: " << giaiMa << endl;
    return 0;
}
