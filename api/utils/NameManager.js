class NameManager {
    static ValidateName(name) {
        const regex = /^[a-zA-Z\s@._-]+$/;
        return regex.test(name);
    }
    static SanitizeName(name) {
        return name.trim();
    }
}