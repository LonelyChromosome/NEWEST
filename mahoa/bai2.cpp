
#include <bits/stdc++.h>
#include <openssl/sha.h>
using namespace std;
/*void inGiaTri(string X, unsigned char Y[32], string G) {
    auto in = [](string s) {
        for (unsigned char c : s) printf("%02X", c);
        cout << endl;
    };
    string y((char*)Y, 32);
    cout << "X: "; in(X);
    cout<<endl;
    cout << "Y: "; in(y);
    cout<<endl;
    cout << "XY: "; in(X + y);
    cout<<endl;
    cout << "G: "; in(G);
    cout<<endl;
}*/
int main() {
    string ten;
    cout << "Nhap file X: ";
    getline(cin, ten);
    ifstream f(ten, ios::binary);
    if (!f) {
        cout << "Khong tim thay file!";
        return 1;
    }
    string X((istreambuf_iterator<char>(f)), {});
    unsigned char Y[32];
    SHA256((unsigned char*)X.data(), X.size(), Y);
    ofstream out("XY.bin", ios::binary);
    out.write(X.data(), X.size());
    out.write((char*)Y, 32);
    out.close();
    string des = "openssl enc -des-cbc -provider default -provider legacy -K 3132333435363738 -iv 0001020304050607";
    if (system((des + " -in XY.bin -out X.des").c_str()) != 0 ||
        system((des + " -d -in X.des -out G.bin").c_str()) != 0) {
        cout << "Loi DES!";
        return 1;
    }
    ifstream in("G.bin", ios::binary);
    string G((istreambuf_iterator<char>(in)), {});
    if (G.size() < 32) {
        cout << "KHONG TOAN VEN";
        return 1;
    }
    SHA256((unsigned char*)G.data(), G.size()-32, Y);
    if (memcmp(Y, G.data()+G.size()-32, 32) == 0)
        cout << "TOAN VEN"<<endl;
    else
        cout << "KHONG TOAN VEN"<<endl;
    return 0;
}
