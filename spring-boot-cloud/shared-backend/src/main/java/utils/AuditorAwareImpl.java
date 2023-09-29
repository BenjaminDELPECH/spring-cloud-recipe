package utils;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuditorAwareImpl implements AuditorAware<Long> {

    @Override
    public Optional<Long> getCurrentAuditor() {
        // Récupère le contexte de sécurité actuel
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Retourne un Optional vide si l'utilisateur n'est pas authentifié
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }

        // Sinon, retourne le nom d'utilisateur (ou tout autre identifiant unique)
        return Optional.ofNullable((Long) authentication.getPrincipal());
    }
}
